import type { ElementNode, TemplateChildNode } from '@vue/compiler-dom'
import type MagicString from 'magic-string'
import { kebabCase } from 'scule'
import { parseFilename } from 'ufo'

const MAX_STRING_LENGTH = 100
const MAX_PREVIEW_CLASSES = 5
const EXAMPLE_IMPORT = /^(?:~|@|\.\.).*\.vue$/
const ACTION_HELPER = /^\w+Action$/

// Shapes an example SFC for the code tabs. The parsers and prettier load on demand,
// so pages that only render the live preview never download them.
async function formatExample(source: string) {
  const [{ parse, NodeTypes }, { parse: parseScript }, { default: MagicString }, { default: jsTokens }, { format }, html] = await Promise.all([
    import('@vue/compiler-dom'),
    import('@babel/parser'),
    import('magic-string'),
    import('js-tokens'),
    import('prettier/standalone'),
    import('prettier/plugins/html'),
  ])

  // More than MAX_PREVIEW_CLASSES static classes become "...";
  // data-preview-keep-class="a,b" shows only those classes instead.
  function simplifyClass(element: ElementNode, code: MagicString) {
    const attributes = element.props.filter(prop => prop.type === NodeTypes.ATTRIBUTE)
    const keep = attributes.find(attribute => attribute.name === 'data-preview-keep-class')
    const classAttribute = attributes.find(attribute => attribute.name === 'class')
    if (keep) code.remove(keep.loc.start.offset, keep.loc.end.offset)
    if (!classAttribute?.value) return

    const classes = classAttribute.value.content.split(/\s+/).filter(Boolean)
    const shown = keep
      ? (keep.value?.content ?? '').split(',').map(name => name.trim()).filter(name => classes.includes(name))
      : classes.length > MAX_PREVIEW_CLASSES ? ['...'] : classes
    const { start, end } = classAttribute.loc
    if (shown.length) code.overwrite(start.offset, end.offset, `class="${shown.join(' ')}"`)
    else code.remove(start.offset, end.offset)
  }

  function simplifyElements(nodes: TemplateChildNode[], code: MagicString) {
    for (const node of nodes) {
      if (node.type !== NodeTypes.ELEMENT) continue
      if (node.tag === 'ExampleWrapper') {
        const first = node.children[0]
        const last = node.children.at(-1)
        if (first && last) {
          code.remove(node.loc.start.offset, first.loc.start.offset)
          code.remove(last.loc.end.offset, node.loc.end.offset)
        }
        else {
          code.remove(node.loc.start.offset, node.loc.end.offset)
        }
      }
      else {
        simplifyClass(node, code)
      }
      simplifyElements(node.children, code)
    }
  }

  // Prettier re-indents the template and puts a tag on one line when it fits in 80 columns.
  async function formatTemplate(template: ElementNode) {
    if (!template.innerLoc) return ''
    const code = new MagicString(source)
    simplifyElements(template.children, code)
    const inner = code.slice(template.innerLoc.start.offset, template.innerLoc.end.offset).trim()
    if (!inner) return ''
    const formatted = await format(`<template>\n${inner}\n</template>`, { parser: 'vue', plugins: [html] })
    return formatted.trim()
  }

  // Drops the ExampleWrapper plumbing (its import, `const actions`, `function *Action`)
  // and replaces strings longer than MAX_STRING_LENGTH with '...'.
  function formatScript(script: string) {
    const code = new MagicString(script)
    for (const statement of parseScript(script, { sourceType: 'module', plugins: ['typescript'] }).program.body) {
      const exampleOnly
        = (statement.type === 'ImportDeclaration' && EXAMPLE_IMPORT.test(statement.source.value))
          || (statement.type === 'VariableDeclaration' && statement.declarations.some(({ id }) => id.type === 'Identifier' && id.name === 'actions'))
          || (statement.type === 'FunctionDeclaration' && ACTION_HELPER.test(statement.id?.name ?? ''))
      if (exampleOnly) code.remove(statement.start ?? 0, statement.end ?? 0)
    }
    const stripped = code.toString().replace(/\n{3,}/g, '\n\n').trim()
    return Array.from(jsTokens(stripped), token =>
      token.type === 'StringLiteral' && token.value.length - 2 > MAX_STRING_LENGTH
        ? `${token.value[0]}...${token.value[0]}`
        : token.value).join('')
  }

  const blocks = parse(source, { parseMode: 'sfc' }).children.filter(node => node.type === NodeTypes.ELEMENT)
  const block = (tag: string) => blocks.find(node => node.tag === tag)
  const template = block('template')
  return {
    script: formatScript(block('script')?.innerLoc?.source ?? ''),
    template: template ? await formatTemplate(template) : '',
    style: block('style')?.innerLoc?.source.trim() ?? '',
  }
}

export const useCodeBlockPreview = async (src: string, code = true) => {
  const components = import.meta.glob<string>('../components/content/examples/**/*.vue', {
    query: '?raw',
    import: 'default',
  })

  // Normalize path to match glob key
  const globPath = `../components/content/${src}`
  const loadSource = components[globPath]

  if (!loadSource) {
    console.error(`Component not found: ${globPath}`, Object.keys(components))
    return ''
  }

  // Preview-only callers never render the code, so skip parsing and formatting entirely.
  const { script: finalScript, template: finalTemplate, style: finalStyle } = code
    ? await formatExample((await loadSource()) || '')
    : { script: '', template: '', style: '' }

  // Determine component name for preview
  const filename = parseFilename(src.replace('.vue', ''))
  const componentName = kebabCase(filename || '')
  const githubUrl = `https://github.com/astraldev/nanime/blob/main/docs/app/components/content/${src}`

  const codeGroup = `
::code-group
${finalScript
  ? `\`\`\`ts [Script]
${finalScript.trim()}
\`\`\`
`
  : ''}
${finalTemplate
  ? `\`\`\`vue [Template]
${finalTemplate.trim()}
\`\`\`
`
  : ''}
${finalStyle
  ? `\`\`\`css [CSS]
${finalStyle.trim()}
\`\`\`
`
  : ''}
::
`

  const md = `
::${kebabCase(componentName)}
::
${code ? codeGroup : ''}

::u-button
---
to: ${githubUrl}
target: _blank
variant: link
color: neutral
icon: i-simple-icons-github
class: mt-2.5 pl-0.5
---
View on GitHub
::
`

  // Parse Markdown using local highlighter to bypass missing API endpoint
  let highlighter
  if (import.meta.server) {
    try {
      highlighter = await import('#mdc-highlighter').then(m => m.default)
    }
    catch (e) {
      console.error('[useCodeBlockPreview] Failed to import #mdc-highlighter', e)
    }
  }

  const parseOptions = highlighter ? { highlight: { highlighter } } : {}
  const { parseMarkdown } = await import('@nuxtjs/mdc/runtime')
  return await parseMarkdown(md, parseOptions)
}
