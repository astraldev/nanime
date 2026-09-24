---
name: Create Playground Pages
description: Guide for creating test pages for a composable or component in the docs app's playground routes
---

# When to use

Use this skill to build a page for testing a composable or component by
hand, including edge cases that don't belong in the docs.

# Where pages live

There is no separate `playground/` app. Test pages live in the docs app
under `docs/app/pages/playground/`, e.g.
`docs/app/pages/playground/transitions.vue`. They are served at
`/playground/<name>` by `pnpm dev` (port 3001) and are not linked from the
docs navigation.

The docs app loads the module's built `dist/`, not `src/`. After changing
`src/`, restart `pnpm dev`, which rebuilds the module, before testing.

# How to create a page

1. Read the source under `src/runtime/app/` (`composables/`,
   `components/`) to learn the props, parameters and return values.
2. Create `docs/app/pages/playground/<name>.vue`. Add
   `useSeoMeta({ title: '<Name> playground', robots: 'noindex, nofollow' })`.
3. Use Nuxt UI components (`UContainer`, `UButton`), which the docs app
   already has.
4. Cover the normal cases, then add an "Edge cases" section. Each case gets
   its own small block with a one-line caption saying what to watch for:
   rapid clicking, user CSS transitions on the element, user inline styles,
   centred content (`grid place-items-center`), siblings next to the
   target, reverts on unmount.
5. For Anime.js reference behaviour, read
   `node_modules/animejs/dist/modules/<module>/`. There is no `anime-core`
   submodule. Use only APIs the module exposes.

# Rules

1. No `as` casts and no `any`.
2. No comments.
3. Don't change the composable or component to make the page work. If the
   page exposes a bug, report it.
4. Verify in a visible browser. The in-app browser pane often reports
   `document.visibilityState === 'hidden'`. When hidden,
   `requestAnimationFrame` doesn't fire and Anime.js pauses, so nothing
   animates. Say plainly that visual checks were not possible rather than
   guessing. Inline styles written synchronously (e.g. by layout at the
   start of a move) can still be read with `javascript_tool`.

# Verification

1. `pnpm lint` passes
2. `pnpm test:types` passes
3. The route returns 200 from the running dev server
