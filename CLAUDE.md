# Nanime — Nuxt + Anime.js Module

Nuxt module (`nanime`) wrapping [Anime.js v4](https://animejs.com/) with Vue 3 reactivity. Auto-imports composables.

## Quick Reference

| What | Where |
|---|---|
| Module entry | `src/module.ts` |
| Composables | `src/runtime/app/composables/` |
| Utilities / types | `src/runtime/app/utils/` |
| Anime.js source | `anime-core/anime/` (git submodule, v4.4.1) |
| Docs site (Docus) | `docs/` — dev on port 3001 |
| Playground | `playground/` |
| Tests | `test/` — 4 vitest projects (unit, e2e, fixtures, suites) |
| Agent skills | `.agents/skills/` (also symlinked at `.agent/skills`) |

## Anime.js Setup

Anime.js lives at `anime-core/anime/` as a git submodule (`git@github.com:juliangarnier/anime.git`). After cloning the project:

```sh
git submodule update --init
```

Runtime values must be imported from submodule paths — never the top-level `'animejs'` barrel. Type-only imports from `'animejs'` are fine.

```ts
import { animate } from 'animejs/animation'
import { createAnimatable } from 'animejs/animatable'
import { createDraggable } from 'animejs/draggable'
import { createLayout } from 'animejs/layout'
import { createTimeline } from 'animejs/timeline'
import { splitText } from 'animejs/text'
import { waapi } from 'animejs/waapi'
import { set, stagger, round } from 'animejs/utils'
import type { AnimationParams, TargetsParam } from 'animejs' // types OK
```

These are pre-optimized via Vite in `src/module.ts` (lines 31–50).

## Module Aliases

Available throughout the Nuxt app:

- `#nanime/composables` — composables directory
- `#nanime/types` — type definitions
- `#nanime/easings` — easing utilities
- `#nanime/utils` — re-exports of `animejs/utils`
- `#nanime/proxies` — root re-export of all animation parameter proxies (text, svg)
- `#nanime/proxies/text` — re-exports `scrambleText` from `animejs/text` (use inside composable params, not as a standalone API)
- `#nanime/proxies/svg` — re-exports `morphTo`, `createMotionPath`, `createDrawable` from `animejs/svg`

## Creating a New Composable

1. Create `src/runtime/app/composables/use<Name>.ts`
2. Export a named function `use<Name>` — follows Vue composable convention
3. Auto-imported via `addImportsDir` in `src/module.ts:60-62` — no manual registration needed

**Pattern to follow** (see existing composables for reference):

```ts
import { toReactive, tryOnScopeDispose, useMounted } from '@vueuse/core'
import { shallowRef, toValue, watchEffect, type MaybeRefOrGetter } from 'vue'
import { normalizeAnimeTarget } from '../utils/normalize-targets'

export function use<Name>(target: ..., parameters?: MaybeRefOrGetter<...>) {
  const flag = getAnimationComponentFlag()
  const instance = shallowRef(/* initial */)
  const mounted = useMounted()

  if (flag === AnimationComponentFlags.Watchable) {
    // Reactive mode: watchEffect, revert on change, cleanup on dispose
  } else {
    // Static mode: nextTick init
  }

  return toReactive(instance)
}
```

Key conventions:
- Use `shallowRef` for anime instances (not `ref`)
- Use `normalizeAnimeTarget` / `normalizeWaapiTarget` for targets
- Guard with `useMounted()` — anime needs DOM
- Support both watchable (reactive) and static modes via `AnimationComponentFlags`
- Clean up with `tryOnScopeDispose`
- Return `toReactive(shallowRef)` for ergonomic destructuring

Existing composables: `useAnimate`, `useAnimatable`, `useAnimeTimeline`, `useDraggable`, `useScrambleText`, `useSplitText`, `useWaapiAnimate`

## Scripts

```sh
pnpm dev              # Playground dev server (runs dev:prepare first)
pnpm dev:prepare      # Stub-build module + prepare playground
pnpm test             # Run all vitest projects
pnpm test:types       # Nuxt typecheck
pnpm lint             # ESLint
pnpm prepack          # Build module for publishing
pnpm release          # Lint → test → build → changelog → publish → push tags
```

`pnpm release` bumps the version itself, from the commits since the last tag.
v0.1.12 was tagged by hand because there was no v0.0.11 tag to measure from,
so `changelogen` would have read the range wrong. Every release after it works
off `v0.1.12` normally, so leave the version alone and let the script set it.

Publishing must go through **pnpm**, never `npm publish`. Dependencies use pnpm
catalog specifiers (`catalog:nuxt`), and only pnpm rewrites those into real
ranges when packing. An `npm publish` ships `"animejs": "catalog:runtime"` and
every install of it fails.

## Pre-commit Hooks (Lefthook)

Runs sequentially before commit:
1. `eslint --fix` on staged `.js/.ts/.vue/.mjs` files
2. `pnpm test:types && pnpm test`

## Docs

Docus-based site in `docs/`. Content lives in `docs/content/`:
- `1.getting-started/` — intro, installation, configuration
- `2.composables/` — one page per composable
- `4.misc/` — easings, utils

Run docs dev: `cd docs && pnpm dev` (port 3001).

## Code Style

- Strict TypeScript — no `any`, no `as` casts
- Vue 3 Composition API only
- `@vueuse/core` for reactive utilities
- ESLint enforced (see `eslint.config.mjs`)

## Testing

4 vitest projects configured in `vitest.config.ts`:
- **unit** — `test/unit/`
- **e2e** — `test/e2e/`
- **full-nuxt-apps** — `test/fixtures/`
- **suites** — `test/suites/` (component tests via `mountSuspended`, real components, no mocks)

## Agent Skills

Skills in `.agents/skills/` — each has a `SKILL.md` defining its workflow:

| Skill | Purpose |
|---|---|
| `create-composable` | End-to-end workflow for SSR-safe, memory-safe, version-adaptive composables |
| `create-docs` | Generate Docus documentation pages |
| `scaffold-composable-sample` | Scaffold composable doc page with standard structure |
| `create-playground-page` | Create playground test pages mirroring src structure |
| `create-utility-tests` | Write vitest utility tests (Nuxt test-utils) |
| `create-showcase-doc` | Write/rewrite a showcase example page (`docs/content/5.examples/`), including verifying its AI build prompt against a real independent agent |
| `skill-creator` | Meta-skill for authoring new skills |
