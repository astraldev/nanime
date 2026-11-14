---
name: Create Playground Pages
description: Guide for creating test pages for a composable or component in the docs app's playground routes
---

# When to use

Use this skill to build a page for testing a composable or component by
hand, including edge cases that don't belong in the docs.

# Where pages live

There is no separate `playground/` app. Build test pages in the docs app
under `docs/app/pages/playground/`, served at `/playground/<name>` by
`pnpm dev` (port 3001). They are local and temporary: the docs site ships
no playground pages, so never commit them. When you're done, delete the
page, or move one worth keeping to the same path in `../nanime-tests`.
Shared helpers in `docs/app/components/playground/` are committed.

The docs app loads the module's built `dist/`, not `src/`. After changing
`src/`, run `pnpm prepack` to rebuild `dist/`, then reload the page. The
running dev server picks the new files up; restart `pnpm dev` only if it
doesn't.

If a Tailwind class used only by a new or rewritten page is missing (an
`absolute bottom-full` tooltip landing on its trigger, say), the dev
server's class scan has gone stale. Touch `docs/app/assets/css/main.css`
to make it rescan.

# How to create a page

Check `git status` and `docs/app/pages/playground/` first. The user may be
editing a page in parallel, and a page they already wrote is the source of
truth: read it and align instead of writing a competing one.

1. Read the source under `src/runtime/app/` (`composables/`,
   `components/`) to learn the props, parameters and return values. Also
   read the composable's docs page in `docs/content/2.composables/` and its
   `skills/nanime/references/composables/<name>.md`. When recreating code
   from another library or version, express it in the composable's own
   forms rather than copying values across, and compare it with the
   original per frame.
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
   animates on its own. First call `show_pane` with `pane: "preview"` and
   check `tabs_context` no longer says the pane is hidden. A `javascript_tool`
   call that times out on a `requestAnimationFrame` loop, or styles that
   never appear after a state change, mean the pane is hidden again, and any
   numbers read in that state are wrong. If the pane cannot be shown, drive
   the engine by hand with `javascript_tool` after each page load:

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

5. Expose state to `javascript_tool` on `window` (refs, a `show` flag per
   case, a `probe`). Count live animations with `engine._head` /
   `_next` from `animejs/engine`, which the docs app can import, and report
   the change from a baseline. Do not change state in a hidden pane: the
   changes queue and the next read starts from polluted values, so reload
   first.
6. A getter that calls `onScroll()` builds a new observer on every read,
   which the composable does several times per rebuild. Create observers
   once, outside the getter, or the counts you read measure your page.
7. After `pnpm dev:prepare`, restart the dev server and wait for
   `curl` on the route to return 200 before navigating. The first request
   after a restart can return 500 with "IPC connection closed". Deleting a
   playground page while the pane is open leaves "Outdated Optimize Dep"
   errors, so reload before reading anything.
8. A fix to `src/` found this way needs a regression test in
   `../nanime-tests`, run by copying it to the same path here and deleting
   the copy. Check that it fails without the fix (`git stash push src`).
9. Anime.js animations and timelines autoplay by default. A demo built
   without `autoplay: false` runs once on mount and sits at its end state by
   the time you look. For a page the user triggers, pass `autoplay: false`
   and drive it from a button.
10. A `200` from `curl` only proves the server rendered. Confirm the
    animation actually runs on the client (the engine ticks, inline styles
    change) before calling a demo correct.
11. Prefer the composable's documented position idioms over hardcoded
    absolute times. `useWaapiTimeline` has `point()` labels and relative `<`
    shifts (`<+100%` is the previous tween's end); chain with those instead
    of repeating absolute `at` values.
12. A page can pass every numeric check and still show nothing: a missing
    Tailwind arbitrary class (`grid-cols-[repeat(var(--rows),1rem)]`,
    `bg-primary/50`) collapsed a grid to one column of transparent dots. After
    the first load, read the rect and computed colour of the key elements
    (size, column count, non-transparent background), and put layout-critical
    styles in scoped CSS.
13. If `preview_start` exits with "Another Nuxt dev server is already
    running", don't kill that server. `navigate` the pane to its URL.

# Verification

1. `pnpm lint` passes
2. `pnpm test:types` passes
3. The route returns 200 from the running dev server
