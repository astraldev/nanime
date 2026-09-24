# nanime

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]
[![release nanime][release-src]][release-href]

**Anime.js v4 composables for Nuxt and Vue 3. SSR-safe, reactive, auto-imported.**

`nanime` (Anime.js for Nuxt) brings [Anime.js](https://animejs.com/) v4 into Vue 3 and Nuxt with idiomatic Composition API composables. They resolve element targets automatically, skip execution on the server to prevent hydration mismatches, and clean up animations on component unmount.

- 📖 **Documentation**: [https://nanimejs.netlify.app](https://nanimejs.netlify.app)
- 🎬 **Showcase Examples**: [https://nanimejs.netlify.app/examples/introduction](https://nanimejs.netlify.app/examples/introduction)
- ✨ **Release Notes**: [https://github.com/astraldev/nanime/blob/main/CHANGELOG.md](https://github.com/astraldev/nanime/blob/main/CHANGELOG.md)

---

## Features

- **SSR-safe by default**: animations initialize only on the client DOM, preventing hydration mismatches.
- **Deep Vue reactivity**: watches template refs, reactive objects, and getters, rebuilding or carrying playheads across updates with `keepTime`.
- **9 Auto-imported composables**: covering Anime.js animation, timeline, WAAPI, scroll, layout, dragging, and text effects.
- **Transition components**: `<AnimeTransition>` and `<AnimeTransitionGroup>` animate elements and `v-for` lists in and out with Anime.js, with no CSS to write.
- **Full Anime.js v4 power**: access utilities, springs, custom easings, SVG morphing, and text scramble proxies.
- **Zero-config lifecycle**: automatic memory cleanup and event detachment on component unmount.

---

## Quick Setup

### 1. Install module

Install with Nuxt CLI:

```bash
npx nuxt module add nanime
```

Or install via package manager:

```bash
pnpm add nanime
```

### 2. Register module (if installed manually)

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['nanime'],
})
```

### 3. Usage

Composables are auto-imported and ready to use in any Vue component:

```vue
<script setup lang="ts">
const box = useTemplateRef('box')

useAnimate(box, {
  translateX: 200,
  ease: 'outExpo',
  loop: true,
  alternate: true,
})
</script>

<template>
  <div ref="box" class="box" />
</template>
```

---

## Composables

| Composable | Wraps | Description |
| :--- | :--- | :--- |
| [`useAnimate`](https://nanimejs.netlify.app/composables/use-animate) | `animate()` | Animate CSS properties, transforms, SVG attributes, and plain JS objects. |
| [`useWaapiAnimate`](https://nanimejs.netlify.app/composables/use-waapi-animate) | `waapi.animate()` | Off-main-thread Web Animations API for high-performance transforms and opacity. |
| [`useAnimatable`](https://nanimejs.netlify.app/composables/use-animatable) | `createAnimatable()` | Property setters that tween, ideal for high-frequency cursor or pointer events. |
| [`useSplitText`](https://nanimejs.netlify.app/composables/use-split-text) | `splitText()` | Split text into lines, words, and characters for staggered typography animations. |
| [`useScrambleText`](https://nanimejs.netlify.app/composables/use-scramble-text) | `scrambleText()` | Scramble and reveal characters driven by reactive text strings. |
| [`useDraggable`](https://nanimejs.netlify.app/composables/use-draggable) | `createDraggable()` | Physics-based dragging with boundary constraints, snapping, and axis locks. |
| [`useAnimeTimeline`](https://nanimejs.netlify.app/composables/use-anime-timeline) | `createTimeline()` | Chain and synchronize multiple animations on a shared master clock. |
| [`useAnimeScroll`](https://nanimejs.netlify.app/composables/use-anime-scroll) | `onScroll()` | Drive animations directly from page or container scroll progress. |
| [`useAnimeLayout`](https://nanimejs.netlify.app/composables/use-anime-layout) | `createLayout()` | Animate position and size changes, with `patch()` for Vue-driven DOM updates. |

## Components

| Component | Description |
| --- | --- |
| [`<AnimeTransition>`](https://nanimejs.netlify.app/components/transitions) | Vue's `<Transition>`, with Anime.js enter and leave animations. |
| [`<AnimeTransitionGroup>`](https://nanimejs.netlify.app/components/transitions#lists) | `<TransitionGroup>` for `v-for` lists, with moves animated by Anime.js layout. |

Both take a [transition style](https://nanimejs.netlify.app/components/transition-styles) name (`fade`, `slide-up`, `scale`, `swap`, or your own from `app.config.ts`) or inline Anime.js params.

---

## Comparison with Alternatives

- **[vs Nuxt Modules](https://nanimejs.netlify.app/getting-started/vs-nuxt-modules)**: Compare `nanime` with `@hypernym/nuxt-anime` and raw Anime.js.
- **[vs Vue Packages](https://nanimejs.netlify.app/getting-started/vs-vue-packages)**: Compare `nanime` with `vue-animejs` and `v-anime`.

---

## AI Agents & LLM Discoverability

`nanime` includes dedicated support for AI agents and LLM-assisted development:

- **llms.txt**: Structured markdown documentation feed for LLMs is available at [https://nanimejs.netlify.app/llms.txt](https://nanimejs.netlify.app/llms.txt) and [llms-full.txt](https://nanimejs.netlify.app/llms-full.txt).
- **MCP Server**: Query documentation programmatically via the Model Context Protocol endpoint at `https://nanimejs.netlify.app/mcp`.
- **Agent Skill**: Install it with `npx skills add astraldev/nanime --skill nanime`. It covers the composables, `<AnimeTransition>` / `<AnimeTransitionGroup>`, transition styles, `useAnimeLayout`, and the mistakes that animate the wrong thing without an error. The npm package also ships it in `skills/nanime`.

---

## Requirements

- **Nuxt**: `^3.13.5` or `^4.0.0`
- **Vue**: `^3.5.0`
- **Anime.js**: `^4.5.0` (installed as a dependency of `nanime`)

---

## Documentation & Demos

Visit the official documentation site at **[https://nanimejs.netlify.app](https://nanimejs.netlify.app)** for interactive live demos, full API references, and step-by-step guides.

---

## Contribution

<details>
  <summary>Local development</summary>

  ```bash
  # Install dependencies
  pnpm install

  # Generate type stubs
  pnpm dev:prepare

  # Start development server
  pnpm dev

  # Run ESLint
  pnpm lint

  # Run Vitest
  pnpm test
  ```

</details>

## License

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
