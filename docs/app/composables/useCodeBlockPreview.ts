import { format } from 'prettier/standalone'
import * as parserHtml from 'prettier/plugins/html'
import * as parserTypeScript from 'prettier/plugins/typescript'
import * as parserBabel from 'prettier/plugins/babel'
import * as parserPostCss from 'prettier/plugins/postcss'
import * as prettierPluginEstree from 'prettier/plugins/estree'
import { kebabCase } from 'scule'
import { parseFilename } from 'ufo'
import type { Options } from 'prettier'
import { consola as logger } from 'consola'

export const useCodeBlockPreview = async (src: string) => {
  const components = import.meta.glob('../components/content/examples/**/*.vue', {
    query: '?raw',
    import: 'default',
    eager: true,
  })

  // Normalize path to match glob key
  // src is like "examples/composables/TextDemo.vue"
  // glob keys are like "../components/content/examples/composables/TextDemo.vue"
  const globPath = `../components/content/${src}`

  // Fallback check if the key format differs (e.g. if glob keys are relative to the file)
  // Actually import.meta.glob keys are relative to the file defining them.
  // So they will start with ../components/content/examples/...

  if (!components[globPath]) {
    console.error(`Component not found: ${globPath}`, Object.keys(components))
    return ''
  }

  const content = components[globPath] as string

  // 1. Extract blocks initially
  const scriptMatch = content.match(/<script[^>]*>([\s\S]*?)<\/script>/)
  const templateMatch = content.match(/<template>([\s\S]*?)<\/template>/)
  const styleMatch = content.match(/<style[^>]*>([\s\S]*?)<\/style>/)

  let script = scriptMatch && scriptMatch[1] ? scriptMatch[1] : ''
  let template = templateMatch && templateMatch[1] ? templateMatch[1] : ''
  const style = styleMatch && styleMatch[1] ? styleMatch[1] : ''

  // 2. Find imports to ../**/*.vue, ~/**/*.vue, @/**/*.vue
  const importRegex = /import\s+(\w+)\s+from\s+['"]((?:~|@|\.\.).*?\.vue)['"]\s*/g
  const importsToRemove: string[] = []

  let match
  while ((match = importRegex.exec(script)) !== null) {
    if (!match[1]) continue
    importsToRemove.push(match[1])
  }

  // Remove imports from script
  if (importsToRemove.length > 0) {
    script = script.replace(importRegex, '\n')
    script = script.trim()
  }

  // 3. Remove wrapper usage in template
  importsToRemove.forEach((componentName) => {
    // Regex for <Component>content</Component>
    const wrapperWithContentRegex = new RegExp(`<${componentName}[^>]*>([\\s\\S]*?)<\\/${componentName}>`, 'g')

    // Check if it matches
    const wrapperMatch = wrapperWithContentRegex.exec(template)
    if (wrapperMatch) {
      // Replace with content
      template = template.replace(wrapperWithContentRegex, '$1')
    }
    else {
      // Maybe self closing? <Component /> -> remove
      const selfClosingRegex = new RegExp(`<${componentName}[^>]*\\/>`, 'g')
      template = template.replace(selfClosingRegex, '')

      // Maybe just start/end tags if nested differently
      const startTag = new RegExp(`<${componentName}[^>]*>`, 'g')
      const endTag = new RegExp(`<\\/${componentName}>`, 'g')
      template = template.replace(startTag, '').replace(endTag, '')
    }
  })

  // 4. Format blocks individually
  const formatOptions: Options = {
    singleQuote: true,
    semi: false,
    trailingComma: 'all',
  }

  let finalScript = script
  let finalTemplate = `<template>${template}</template>`
  let finalStyle = style

  finalScript = await format(script, {
    ...formatOptions,
    parser: 'typescript',
    plugins: [parserTypeScript, parserBabel, prettierPluginEstree],
  }).catch((err) => {
    logger.warn(`Failed to parse script for: ${src}`, err)
    return ''
  })

  finalTemplate = await format(finalTemplate, {
    ...formatOptions,
    parser: 'html',
    plugins: [parserHtml],
  }).catch((err) => {
    logger.warn(`Failed to parse template for: ${src}`, err)
    return ''
  })

  finalStyle = await format(style, {
    ...formatOptions,
    parser: 'css',
    plugins: [parserPostCss],
  }).catch((err) => {
    logger.warn(`Failed to parse style for: ${src}`, err)
    return ''
  })

  // Determine component name for preview
  const filename = parseFilename(src.replace('.vue', ''))
  const componentName = kebabCase(filename || '')
  const githubUrl = `https://github.com/astraldev/nanime/blob/main/docs/components/content/${src}`

  const md = `
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

::${kebabCase(componentName)}
::

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
