import { kebabCase } from 'scule'
import { parseFilename } from 'ufo'

function dedent(text: string, baseIndent = 0): string {
  const lines = text.split('\n')
  while (lines.length > 0 && lines[0]?.trim() === '') lines.shift()
  while (lines.length > 0 && lines[lines.length - 1]?.trim() === '') lines.pop()
  if (lines.length === 0) return ''

  const minIndent = lines.reduce((min, line) => {
    if (line.trim() === '') return min
    const match = line.match(/^(\s*)/)
    const indent = match?.[1]?.length ?? 0
    return Math.min(min, indent)
  }, Infinity)

  const prefix = ' '.repeat(baseIndent)
  return lines
    .map(line => (line.trim() === '' ? '' : prefix + line.slice(minIndent)))
    .join('\n')
}

export const useCodeBlockPreview = async (src: string, code = true) => {
  const components = import.meta.glob('../components/content/examples/**/*.vue', {
    query: '?raw',
    import: 'default',
    eager: true,
  })

  // Normalize path to match glob key
  const globPath = `../components/content/${src}`

  if (!components[globPath]) {
    console.error(`Component not found: ${globPath}`, Object.keys(components))
    return ''
  }

  const content = (components[globPath] as string) || ''

  // 1. Extract blocks initially
  const scriptMatch = content.match(/<script[^>]*>([\s\S]*?)<\/script>/)
  const templateMatch = content.match(/<template>([\s\S]*?)<\/template>/)
  const styleMatch = content.match(/<style[^>]*>([\s\S]*?)<\/style>/)

  let script = scriptMatch?.[1] ? scriptMatch[1] : ''
  let template = templateMatch?.[1] ? templateMatch[1] : ''
  const style = styleMatch?.[1] ? styleMatch[1] : ''

  // 2. Find imports to ../**/*.vue, ~/**/*.vue, @/**/*.vue
  const importRegex = /^import\s+(?:\S.*?)??from\s+['"](?:~|@|\.\.).*?\.vue['"]\s*;?\r?\n?/gm
  script = script.replace(importRegex, '\n').replace(/\n{3,}/g, '\n\n').trim()

  // 3. Remove wrapper usage in template
  template = template
    .replace(/<ExampleWrapper[^>]*>([\s\S]*?)<\/ExampleWrapper>/g, '$1')
    .replace(/<ExampleWrapper[^>]*\/>/g, '')

  let finalScript = script
  let finalTemplate = template
  let finalStyle = style

  // Preview-only callers never render these, so skip formatting entirely.
  if (code) {
    finalScript = dedent(script, 0)
    const dedentedTemplate = dedent(template, 2)
    finalTemplate = dedentedTemplate ? `<template>\n${dedentedTemplate}\n</template>` : ''
    finalStyle = dedent(style, 0)
  }

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

  // Parse Markdown (auto-imported)
  return md
}
