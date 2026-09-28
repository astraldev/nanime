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
`src/`, run `pnpm prepack` to rebuild `dist/`, then reload the page. The
running dev server picks the new files up; restart `pnpm dev` only if it
doesn't.

If a Tailwind class used only by a new or rewritten page is missing (an
`absolute bottom-full` tooltip landing on its trigger, say), the dev
server's class scan has gone stale. Touch `docs/app/assets/css/main.css`
to make it rescan.

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

# Comparing defaults side by side

To compare settings for a component (old default against a candidate),
build one page per component with one section per real use case (modal,
toast stack, tag input, accordion, …). Delete the pages once the decision
is made; the docs site ships no comparison pages. The shared pieces in
`docs/app/components/playground/` stay:

- `PlaygroundCompare`: a titled section that renders its slot once per
  column, each inside `PlaygroundDefaultsScope`, so the components in the
  slot take no animation props and get the column's defaults through
  `provideAnimeDefaults`. Columns share state, so one click runs all.
- `PlaygroundTuning`: lists each column's values next to sliders bound
  with `v-model`; its default slot takes extra controls.
- `PlaygroundChoice`: a `v-model` button group with an optional label
  function.
- Column types (`CompareColumn`, `TuningSlider`) are in
  `docs/app/utils/playground.ts`.

Give the "old default" column its values explicitly (or a style name like
`'fade'`), not `{}`, so it keeps showing the old behaviour after the
built-in default changes.

# Rules

1. No `as` casts and no `any`.
2. No comments.
3. Don't change the composable or component to make the page work. If the
   page exposes a bug, report it.
4. Verify with numbers, not screenshots. The in-app browser pane often
   reports `document.visibilityState === 'hidden'`. When hidden,
   `requestAnimationFrame` doesn't fire and Anime.js pauses, so nothing
   animates on its own. Drive it by hand with `javascript_tool` after each
   page load:

   ```js
   window.requestAnimationFrame = cb => setTimeout(() => cb(performance.now()), 16)
   const engine = window.AnimeJS[0].engine
   engine.pauseOnDocumentHidden = false
   engine.useDefaultMainLoop = false
   if (engine.paused) engine.resume()
   const tick = async (frames, sample) => {
     const out = []
     for (let i = 0; i < frames; i++) {
       await new Promise(r => setTimeout(r, 16))
       engine.update()
       out.push(sample(i))
     }
     return out
   }
   ```

   Trigger the interaction, then `tick(30, () => …)` and sample what matters
   per frame: rects relative to the parent, inline styles, text line counts
   via `Range.getClientRects()`. The rAF patch matters too: Anime.js layout
   restores muted transitions in a `requestAnimationFrame`, so without it
   `transition: none !important` looks stuck. If you can't measure it, say
   the check wasn't done rather than guessing.

# Verification

1. `pnpm lint` passes
2. `pnpm test:types` passes
3. The route returns 200 from the running dev server
