# Nanime — Nuxt + Anime.js Module

Nuxt module (`nanime`) wrapping [Anime.js v4](https://animejs.com/) with Vue 3 reactivity. Auto-imports composables and registers the transition components.

## Quick Reference

| What | Where |
|---|---|
| Module entry | `src/module.ts` |
| Composables | `src/runtime/app/composables/` |
| Components | `src/runtime/app/components/` (`AnimeTransition`, `AnimeTransitionGroup`) |
| Public API (`#nanime/*` aliases) | `src/runtime/app/public/` (`types.ts`, `utils.ts`, `easings.ts`, `proxies/`) |
| Internal helpers | `src/runtime/app/utils/` (`targets.ts`, `proxy/`, `instance/`, `vue-helpers.ts`) |
| Transition internals | `src/runtime/app/transitions/` (`runner.ts`, `resolve.ts`, `styles/`) |
| Anime.js source | `node_modules/animejs/dist/modules/` (no submodule) |
| Docs site (Docus) | `docs/` — dev on port 3001, also hosts playground pages at `docs/app/pages/playground/` |
| Tests | `test/` — moving to a private repo |
| Agent skills | `.agents/skills/` (also symlinked at `.agent/skills`) |

## Anime.js Setup

Anime.js comes from `node_modules`. Read its source in `node_modules/animejs/dist/modules/`.

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

These are pre-optimized via Vite (`optimizeDeps.include` in `src/module.ts`).

## Module Aliases

Available throughout the Nuxt app:

- `#nanime/composables` — every composable, re-exported from `public/composables.ts` (for `composables: false`)
- `#nanime/types` — type definitions
- `#nanime/easings` — easing utilities
- `#nanime/utils` — re-exports of `animejs/utils`
- `#nanime/proxies` — root re-export of all animation parameter proxies (text, svg)
- `#nanime/proxies/text` — re-exports `scrambleText` from `animejs/text` (use inside composable params, not as a standalone API)
- `#nanime/proxies/svg` — re-exports `morphTo`, `createMotionPath`, `createDrawable` from `animejs/svg`

## Creating a New Composable

1. Create `src/runtime/app/composables/use<Name>.ts`
2. Export a named function `use<Name>` — follows Vue composable convention
3. Auto-imported via `addImportsDir` in `src/module.ts` — no manual registration needed
4. Add its re-export to `src/runtime/app/public/composables.ts` so `#nanime/composables` exposes it

**Pattern to follow** (see existing composables for reference):

```ts
import { shallowRef, toValue, watchEffect, type MaybeRefOrGetter } from 'vue'
import { toReactive, tryOnScopeDispose, useMounted } from '../utils/vue-helpers'
import { normalizeAnimeTarget } from '../utils/targets'

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

Existing composables: `useAnimate`, `useAnimatable`, `useAnimeLayout`, `useAnimeScroll`, `useAnimeTimeline`, `useDraggable`, `useScrambleText`, `useSplitText`, `useWaapiAnimate`

Code comments: none in internal code. Every public type, prop and module option gets a JSDoc line (with `@default` where there is one), because users see it on hover.

## Scripts

```sh
pnpm dev              # Docs site on :3001, including /playground pages (runs dev:prepare first)
pnpm dev:prepare      # Build the module and prepare the docs app; the docs load dist/, so restart after src/ changes
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
- `1.getting-started/` — intro, installation, configuration, performance, comparison (vs) pages
- `2.composables/` — one page per composable, plus `99.utilities.md` (easings, utils, proxies)
- `3.components/` — transitions and transition styles
- `5.examples/` — showcase examples
- `6.changes/` — changelog

Prose rules live in `.agents/skills/create-docs/references/prose-style.md`: "AnimeJS" in prose, "Anime.js" only in SEO frontmatter and the homepage `<h1>`.

Run docs dev: `cd docs && pnpm dev` (port 3001).

## Code Style

- Strict TypeScript — no `any`, no `as` casts
- Vue 3 Composition API only
- No runtime dependency on `@vueuse/core`; the needed helpers live in `src/runtime/app/utils/vue-helpers.ts`
- ESLint enforced (see `eslint.config.mjs`)

## Testing

Vitest projects in `vitest.config.ts`:
- **full-nuxt-apps** — `test/fixtures/`
- **config** — `test/config/` (runs against the `keep-time` fixture)
- **suites** — `test/suites/` (component tests via `mountSuspended`, real components, no mocks)

`unit` and `e2e` projects are configured but their folders are empty. Tests are moving to a private repo.

## Agent Skills

Skills in `.agents/skills/` — each has a `SKILL.md` defining its workflow:

| Skill | Purpose |
|---|---|
| `create-composable` | End-to-end workflow for SSR-safe, memory-safe, version-adaptive composables |
| `create-docs` | Generate Docus documentation pages. Specs in `references/`: `composable-page-spec.md`, `component-page-spec.md`, `demo-spec.md` (every live demo), `prose-style.md` |
| `scaffold-composable-sample` | Scaffold composable doc page with standard structure |
| `create-playground-page` | Create test pages under `docs/app/pages/playground/` |
| `create-utility-tests` | Write vitest utility tests (Nuxt test-utils) |
| `create-showcase-doc` | Write/rewrite a showcase example page (`docs/content/5.examples/`), including verifying its AI build prompt against a real independent agent |
| `skill-creator` | Meta-skill for authoring new skills |
