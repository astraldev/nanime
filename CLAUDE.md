# Nanime — Nuxt + Anime.js Module

Nuxt module (`nanime`) wrapping [Anime.js v4](https://animejs.com/) with Vue 3 reactivity. Auto-imports composables and transition components.

## Quick Reference

| What | Where |
|---|---|
| Module entry | `src/module.ts` |
| Composables | `src/runtime/app/composables/` |
| Components | `src/runtime/app/components/transition/` |
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

The module imports anime via submodule paths — not the top-level `animejs` package:

```ts
import { animate } from 'animejs/animation'
import { createAnimatable } from 'animejs/animatable'
import { createDraggable } from 'animejs/draggable'
import { createLayout } from 'animejs/layout'
import { splitText } from 'animejs/text'
import { waapi } from 'animejs/waapi'
import * as utils from 'animejs/utils'
```

These are pre-optimized via Vite in `src/module.ts` (lines 31–50).

## Module Aliases

Available throughout the Nuxt app:

- `#nanime/composables` — composables directory
- `#nanime/components` — components directory
- `#nanime/types` — type definitions
- `#nanime/easings` — easing utilities
- `#nanime/utils` — re-exports of `animejs/utils`

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

Existing composables: `useAnimate`, `useAnimatable`, `useDraggable`, `useLayout`, `useSplitText`, `useWaapiAnimate`

## Components

Transition components in `src/runtime/app/components/transition/`. Prefixed with module prefix (default `A`), so `Slide.vue` becomes `<ATransitionSlide>`.

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

## Pre-commit Hooks (Lefthook)

Runs sequentially before commit:
1. `eslint --fix` on staged `.js/.ts/.vue/.mjs` files
2. `pnpm test:types && pnpm test`

## Docs

Docus-based site in `docs/`. Content lives in `docs/content/`:
- `1.getting-started/` — intro, installation, configuration
- `2.composables/` — one page per composable
- `3.components/` — component docs
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
| `skill-creator` | Meta-skill for authoring new skills |
