---
name: patch-animejs-tracked-layout
description: |
  Patch an installed Anime.js v4 so createLayout measures only the elements you name,
  instead of walking every descendant of the layout root. Use when a layout animation
  is slow on large lists, tables or dashboards (hundreds of elements per update), when
  <AnimeLayoutGroup> janks on reorder/filter, or when someone asks for
  `trackTargetsOnly` / "measure only targets". The patch is a local install change
  (pnpm patch), not a nanime option: it also works with raw `createLayout`.
---

# Patch Anime.js for tracked layout

`createLayout()` walks the whole subtree of its root on every update. On a large list
that is thousands of computed-style reads and layout snapshots per frame. The patch
makes the walk follow only the `children` targets, their ancestors and the siblings of
both. Everything else is left alone, so it does not move and does not animate.

The patch is written against **animejs 4.5.0**. Check the installed version first; on a
different version the hunks may not apply, so regenerate them (see [how-it-works.md](references/how-it-works.md)).

## 1. Check the version

```sh
node -p "require('animejs/package.json').version"
```

If it is not `4.5.0`, read [how-it-works.md](references/how-it-works.md) before applying
the patches; the behaviour is the same, the line numbers are not.

## 2. Patch the installed package

Use the package manager's own patch workflow, so the patch survives installs and is
recorded in the lockfile/package manifest:

```sh
pnpm patch animejs@4.5.0
```

`pnpm patch` prints a temporary directory. From that directory (it is the package root),
apply the two patches in this skill:

```sh
git apply /path/to/skills/patch-animejs-tracked-layout/references/layout-js.patch
git apply /path/to/skills/patch-animejs-tracked-layout/references/layout-types.patch
grep -n "trackTargetsOnly" dist/modules/layout/layout.js dist/modules/layout/layout.d.ts
pnpm patch-commit <the printed directory>
```

With npm or yarn, use `patch-package`: put the same diff under
`patches/animejs+4.5.0.patch` and add `"postinstall": "patch-package"` to the app's
`package.json`. The diff paths are relative to the package root (`dist/modules/...`).

Both patches matter: the first changes the walk, the second makes
`trackTargetsOnly` part of `AutoLayoutParams`, which nanime's `layoutOptions`
type is built from. Without it the option works at runtime but TypeScript
rejects it.

If `git apply` says `Skipped patch`, you are running it from inside another git
repository and it resolved the paths against that root. Run it from the patch
directory that `pnpm patch` printed, or use `patch -p1 < …` there.

## 3. Turn it on for a layout

The patched `createLayout()` only tracks when its params say so. There is no global
switch: pass the flag per layout.

**With nanime** (the `<AnimeLayoutGroup>` path):

```vue
<AnimeLayoutGroup
  :elements="'.card, .row, .toolbar'"
  :layout-options="{ trackTargetsOnly: true }"
>
  …
</AnimeLayoutGroup>
```

Every element that moves or must stay pinned goes in `elements`. Selectors are scoped
to the group, and `layoutOptions` is passed through to `createLayout()` unchanged.

Or with the composable:

```ts
const layout = useAnimeLayout(root, {
  children: '.card, .row',
  trackTargetsOnly: true,
})
```

**Without nanime**, the raw call:

```ts
import { createLayout } from 'animejs/layout'

const layout = createLayout(root, {
  children: '.card, .row',
  trackTargetsOnly: true,
})
```

Do not turn it on globally through `app.config.ts` defaults unless every layout passes
its own `elements`: with the default `children: '*'` there are no tracked children, so
nothing is measured and nothing animates.

## 4. Mark the scene correctly

- **Targets are the elements that move.** Make the cards/rows themselves targets, not
  their containers. Mark a wrapper too if it changes size.
- **Content inside a target reflows, it does not animate.** If text inside a card must
  animate separately, that text is another target.
- **Ancestors and siblings of targets are measured** so the targets keep their place.
- **Grid targets** with no recorded children keep `display: grid` during the animation.
- **Tables** still lose their table layout when rows leave flow. That is an Anime.js
  limitation, not something this patch fixes.
- **No culling.** Every target is still measured; the win comes from skipping the
  non-target descendants, so a scene with thousands of targets gains little.

## 5. Verify

1. `git diff` inside the patch directory shows only the two files above; commit it with
   `pnpm patch-commit`.
2. The app builds and a layout update no longer janks. Compare update time before/after
   on the same scene; the reference implementation measured 4×–6× faster on 200-card
   lists and dashboards.
3. Check the patch survived a clean install (`rm -rf node_modules && pnpm install`).
4. If something breaks, remove the `patchedDependencies` entry and reinstall.
5. After an animejs upgrade, re-run the patch workflow. A stale patch for the old
   version is either skipped or breaks the install; the version check in step 1 is the
   guard.

## Reference

- [layout-js.patch](references/layout-js.patch) — the behaviour change in
  `dist/modules/layout/layout.js`.
- [layout-types.patch](references/layout-types.patch) — adds `trackTargetsOnly` to
  `LayoutOptions` so TypeScript and nanime's prop types accept it.
- [how-it-works.md](references/how-it-works.md) — what each hunk does, how to move the
  patch to another Anime.js version, and the limits.
