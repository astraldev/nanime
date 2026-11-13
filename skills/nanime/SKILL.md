---
name: nanime
description: |
  Build animations in a Nuxt app with nanime, the Nuxt module wrapping Anime.js v4.
  Use when animating elements, text, SVG or scroll in Nuxt: useAnimate, useWaapiAnimate,
  useAnimatable, useAnimeTimeline, useDraggable, useSplitText, useScrambleText,
  useAnimeScroll, useAnimeLayout, <AnimeTransition>, <AnimeTransitionGroup>,
  <AnimeLayoutGroup>, transition styles, component defaults, provideAnimeDefaults,
  the #nanime/* aliases, and the experimental useWaapiTimeline from
  #nanime/experimental, and nanime/vue in a Vue app without Nuxt. Also use when an effect seems to need raw animejs, GSAP or CSS
  transition classes. Most mistakes here do not throw; they animate the wrong thing.
---

# nanime

The composables own an Anime.js instance, rebuild it when reactive inputs
change, and revert it on unmount. They wait for mount, so they are SSR-safe.
Composables and components are auto-imported and auto-registered.

Don't drop to `onMounted` with raw `animejs` imports, and don't reach for GSAP
or transition CSS. The effect almost always has a nanime path.

## Pick the tool

| Building | Use | Details |
|---|---|---|
| Animating elements, refs, arrays, plain objects | `useAnimate` (`useWaapiAnimate` for the Web Animations API) | [use-animate.md](references/composables/use-animate.md) |
| Values set imperatively at speed (cursor follow, live counter) | `useAnimatable` | |
| Sequencing | `useAnimeTimeline` | [use-anime-timeline.md](references/composables/use-anime-timeline.md) |
| Native WAAPI clock, state toggles, callbacks | `useWaapiTimeline` (experimental, `#nanime/experimental`) | [use-waapi-timeline.md](references/composables/use-waapi-timeline.md) |
| SVG draw, morph and motion path | `#nanime/proxies/svg` inside `useAnimate` or `useAnimeTimeline` | [use-anime-timeline.md](references/composables/use-anime-timeline.md) |
| Scroll-driven animation | `useAnimeScroll` | [use-anime-scroll.md](references/composables/use-anime-scroll.md) |
| Text split into lines, words, chars | `useSplitText` | [use-split-text.md](references/composables/use-split-text.md) |
| Scrambling or revealing text | `useScrambleText` | [use-scramble-text.md](references/composables/use-scramble-text.md) |
| Dragging with snap, bounds, axis locks | `useDraggable` | [use-draggable.md](references/composables/use-draggable.md), including draggable list items |
| `v-if` / `v-show` / keyed enter and leave, crossfades | `<AnimeTransition>` | [transition.md](references/components/transition.md), [transition-styles.md](references/components/transition-styles.md) |
| `v-for` add, remove, reorder, stagger | `<AnimeTransitionGroup>` | [transition-group.md](references/components/transition-group.md) |
| Mounted elements changing position or size (FLIP) | `<AnimeLayoutGroup>`, or `useAnimeLayout` to `await` it | [layout-group.md](references/components/layout-group.md), [use-anime-layout.md](references/composables/use-anime-layout.md) |
| App-wide defaults, presets, `provideAnimeDefaults` | `app.config.ts` | [defaults.md](references/guides/defaults.md) |
| Reduced motion | `nanime.reducedMotion` | [accessibility.md](references/guides/accessibility.md) |
| Testing an animation without a browser | | [verifying.md](references/guides/verifying.md) |

`useWaapiAnimate` and `useAnimatable` have no page of their own here. Read
their docs pages: https://nanimejs.netlify.app/composables/use-waapi-animate and
https://nanimejs.netlify.app/composables/use-animatable.

A `useAnimatable` setter retargets from the current value and restarts the
tween from its first frame, so speed does not carry over between calls. For
a value retargeted continuously (pointer follow, scroll, audio level), use
an ease that starts fast (`'out(3)'`) and set the lag with the duration. An
ease that starts slow, such as a `spring` or `'inOut'`, restarts slow on
every call and stutters. Keep springs for one-off moves.

For a layout scene with hundreds of elements, the walk itself becomes the
cost. [patch-animejs-tracked-layout](../patch-animejs-tracked-layout/SKILL.md)
patches the installed Anime.js to measure only the named targets.

For an Anime.js parameter, return shape or util, read
https://animejs.com/documentation. nanime passes those through unchanged.
For nanime's own API, read https://nanimejs.netlify.app/llms-full.txt or query
the docs MCP server at https://nanimejs.netlify.app/mcp.

## Aliases

Not auto-imported. Import helpers from these, never from `animejs` directly.

| Alias | Holds |
|---|---|
| `#nanime/types` | Anime.js types (`AnimationParams`, `JSAnimation`, …), `AnimeTransitionStyle`, `AnimationPreset` and `NanimeConfig` |
| `#nanime/utils` | Anime.js utils (`stagger`, `random`, `set`, …), `animate` and `createTimer` for handler code, and `defineAnimationPreset` |
| `#nanime/easings` | `spring`, `cubicBezier`, `steps`, … |
| `#nanime/proxies/svg` | `createMotionPath`, `createDrawable`, `morphTo` |
| `#nanime/proxies/text` | `scrambleText`, for use inside animation parameters |
| `#nanime/proxies` | Both of the above |
| `#nanime/composables` | Every composable, for `composables: false` in `nuxt.config.ts` |
| `#nanime/experimental` | `useWaapiTimeline`, `createWaapiTimeline` and their types. Not auto-imported. |

When another auto-import also uses a nanime composable name, such as
VueUse's `useDraggable`, the build warns and the app gets nanime's. Set
`nanime: { aliases: true }` in `nuxt.config.ts` to rename nanime's instead
(`useAnimeDraggable`). Docs:
https://nanimejs.netlify.app/guides/configuration#fix-auto-import-name-clashes

## Vue without Nuxt

Import everything from `nanime/vue`: composables, components, types,
easings, proxies and utilities. Nothing is auto-imported and the
`#nanime/*` aliases do not exist, so register the components yourself. Call
`configureNanime(app, config)` before the app mounts. `config` has the shape
of the `nanime` key in `app.config.ts`. Docs:
https://nanimejs.netlify.app/guides/vue

## Rules that apply everywhere

Each of these fails without an error.

### Call composables only in `setup`

```ts
function onClick() {
  useAnimate(box, { x: 100 })   // leaks: no effect scope, never reverted
}
```

From a handler or per-frame callback, use `animate` from `#nanime/utils` and
own the handle:

```ts
import { animate } from '#nanime/utils'
import type { JSAnimation } from '#nanime/types'

const pulse = shallowRef<JSAnimation | null>(null)
onScopeDispose(() => pulse.value?.revert())

function highlight(el: HTMLElement) {
  pulse.value?.revert()
  pulse.value = animate(el, { scale: [1, 1.1, 1], duration: 400 })
}
```

Code of your own that reads an element must also wait for mount.

### Pass composable returns straight in

nanime unwraps a composable's return value to its Anime.js instance, in
parameters and in a timeline's `sync()`. A scroll observer is the usual case:
see [use-anime-scroll.md](references/composables/use-anime-scroll.md).

### Live values do not tick in a template

`{{ animation.progress }}` never updates; the return value tracks the
instance, not the numbers inside it. Copy the value out from a callback:

```ts
const progress = ref(0)
useAnimate(box, { x: 400, onUpdate: self => progress.value = self.progress })
```

### Rebuilds restart the animation

When a reactive target or parameter changes, the composable reverts the old
instance and builds a new one, from the start, unless `rebuild` says
otherwise (`'keepTime'`, `'keepValue'`, which cancels the old instance
instead of reverting it). See
[use-animate.md](references/composables/use-animate.md).

### Give list and layout groups `deps`

Without `deps`, `<AnimeTransitionGroup>` and `<AnimeLayoutGroup>` measure
every element inside them on each re-render. Pass `deps` by default and list
every value whose change moves or resizes items: `:deps="[]"` for list
changes only, `:deps="[view]"` when `view` also resizes items. See
[transition-group.md](references/components/transition-group.md) and
[layout-group.md](references/components/layout-group.md).

### Text a composable rewrites must not re-render

`useScrambleText` and `useSplitText` write into the element, so render the
first value once with `v-once` and hand changes to the composable. See
[use-scramble-text.md](references/composables/use-scramble-text.md) and
[use-split-text.md](references/composables/use-split-text.md).
