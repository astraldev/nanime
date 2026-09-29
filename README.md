# nanime

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]
[![release nanime][release-src]][release-href]

`nanime` lets you use [Anime.js](https://animejs.com/) v4 in Nuxt through composables. You call them in `setup()` like any other composable, and they wait for the element to mount, skip the server render, and clean up when the component goes away.

- Animate elements, text, SVG, drag and scroll with nine composables.
- Pass a `ref` or a getter, and the animation rebuilds when it changes.
- Animate `v-if` and `v-for` with `<AnimeTransition>` and `<AnimeTransitionGroup>`.
- Use all of it without imports, since the module auto-imports everything.

## <a name="getting-started">🚀 Getting Started</a>

```bash
npx nuxi module add nanime
```

It works with Nuxt 3.13.5 and up, and Nuxt 4.

## <a name="usage">💻 Usage</a>

Composables are auto-imported, so there's nothing to import:

```vue
<script setup lang="ts">
const box = useTemplateRef('box')

useAnimate(box, { x: 200, loop: true, alternate: true })
</script>

<template>
  <div ref="box" />
</template>
```

## <a name="documentation">📖 Documentation</a>

Everything lives on [nanimejs.netlify.app](https://nanimejs.netlify.app), with a live demo on every composable page. The [changelog](https://nanimejs.netlify.app/changes/changelog) has what changed in each release.

## <a name="ai-agents">🤖 AI Agents</a>

If you use a coding agent, give it the `nanime` skill so it knows how to use the composables (instead of falling back to plain Anime.js inside `onMounted`):

```bash
npx skills add astraldev/nanime --skill nanime
```

The docs site also has an [MCP server and llms.txt](https://nanimejs.netlify.app/getting-started/installation#use-with-ai-agents), if your agent prefers those.

## <a name="versioning">🏷️ Versioning</a>

`nanime` hasn't hit 1.0 yet, so a minor release (0.2 → 0.3) can have breaking changes. Patch releases (0.2.0 → 0.2.1) won't.

The good news is that the default `^` range in your `package.json` only picks up patches, so you only move to a new minor when you decide to. When you do, the changelog tells you what to change.

## <a name="local-development">🏠 Local Development</a>

Clone the repo, then:

```bash
pnpm install
pnpm dev      # docs and playground on :3001
pnpm test
```

## <a name="license">⚖️ License</a>

[MIT](https://github.com/astraldev/nanime/blob/main/LICENSE) &copy; 2026 Ekure Edem

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/nanime/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/nanime

[npm-downloads-src]: https://img.shields.io/npm/dm/nanime.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npm.chart.dev/nanime

[license-src]: https://img.shields.io/npm/l/nanime.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://github.com/astraldev/nanime/blob/main/LICENSE

[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt
[nuxt-href]: https://nuxt.com

[release-src]: https://github.com/astraldev/nanime/actions/workflows/npm-publish.yml/badge.svg
[release-href]: https://github.com/astraldev/nanime/actions/workflows/npm-publish.yml
