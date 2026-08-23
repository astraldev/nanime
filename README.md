# nanime

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]
[![release nanime][release-src]][release-href]

This module provides a set of SSR safe composables to make it easier
to use [AnimeJS](https://animejs.com/) in your Nuxt application.

- [✨ &nbsp;Release Notes](/CHANGELOG.md)
- [📖 &nbsp;Documentation](https://nanimejs.netlify.app)
<!-- - [🏀 Online playground](https://stackblitz.com/github/your-org/my-module?file=playground%2Fapp.vue) -->

## Features

- Helps integrate animejs into your project without boilerplate code
- SSR-safe composables (`useAnimate`, `useWaapiAnimate`, `useAnimeTimeline`, `useSplitText`, `useScrambleText`, `useDraggable`, `useAnimatable`, `useAnimeLayout`)
- Deep Vue reactivity with template refs, computed properties, and getters
- Direct access to AnimeJS utilities, easings, SVG, and text proxies
- Automatic lifecycle management and memory cleanup on unmount
- Zero-config setup with auto-imports

## Quick Setup

### Installation with `nuxt module` command

Install the module to your Nuxt application with one command:

```bash
npx nuxt module add nanime
```

### Manual install

```bash
npm install nanime
```

Then add the module to the `modules` section of your `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['nanime'],
})
```

That's it! You can now use the module in your application.

## Documentation

Visit [https://nanimejs.netlify.app](https://nanimejs.netlify.app) for full documentation, composables API references, and interactive examples.

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

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/nanime/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/nanime

[npm-downloads-src]: https://img.shields.io/npm/dm/nanime.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npm.chart.dev/nanime

[license-src]: https://img.shields.io/npm/l/nanime.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/nanime

[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt
[nuxt-href]: https://nuxt.com

[release-src]: https://github.com/astraldev/nanime/actions/workflows/npm-publish.yml/badge.svg
[release-href]: https://github.com/astraldev/nanime/actions/workflows/npm-publish.yml

