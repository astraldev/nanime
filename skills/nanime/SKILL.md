---
name: nanime
description: |
  Build animations in a Nuxt app with nanime, the Nuxt module wrapping Anime.js v4.
  Use when animating elements, text, SVG paths or scroll position in Nuxt: useAnimate,
  useWaapiAnimate, useAnimatable, useAnimeTimeline, useDraggable, useSplitText,
  useScrambleText, useAnimeScroll, useAnimeLayout, the <AnimeTransition> and
  <AnimeTransitionGroup> components, transition styles in app.config.ts, and the
  #nanime/* aliases. Read the failure modes below before shipping. Most mistakes here
  do not throw, they animate the wrong thing. Use it too when an effect seems to need
  raw animejs, GSAP, or CSS transition classes.
---

# nanime

## Purpose

nanime wraps Anime.js v4 instances in Vue reactivity: the composables own each
instance, rebuild it when your reactive inputs change, and revert it when the
component unmounts. This file covers correct usage and the failures that produce
no error.

## When to Use

- Animating DOM elements, SVG, text or plain objects in a Nuxt app
- Driving an animation from scroll position
- Splitting text into lines, words or characters to animate
- Making an element draggable
- Sequencing several animations on a timeline
- Animating `v-if` / `v-show` / keyed elements in and out, and `v-for` lists
  that add, remove or reorder items

## Composables

All are auto-imported. No import statement is needed.

| Composable | For |
|---|---|
| `useAnimate` | The general case. Elements, refs, arrays, plain objects |
| `useWaapiAnimate` | The same, through the browser's Web Animations API |
| `useAnimatable` | Values you set imperatively at speed, such as cursor-following |
| `useAnimeTimeline` | Sequencing. Chain `.add()`, `.set()`, `.label()`, `.sync()` |
| `useDraggable` | Dragging, with snapping, bounds and axis locks |
| `useSplitText` | Splitting text into lines, words and characters |
| `useScrambleText` | Scrambling and revealing an element's text |
| `useAnimeScroll` | A scroll observer, to scrub an animation with scroll position |
| `useAnimeLayout` | Animating position and size when mounted elements change layout. `patch(fn)` records, runs `fn`, waits a tick, animates |

## Components

Auto-registered, like Vue's `<Transition>` and `<TransitionGroup>` but with
Anime.js running the animations. Write no transition CSS.

```vue
<template>
  <AnimeTransition enter-animation="slide-up" leave-animation="fade">
    <div v-if="open" />
  </AnimeTransition>

  <AnimeTransitionGroup tag="ul" class="relative" enter-animation="scale" leave-animation="scale">
    <li v-for="item in items" :key="item.id">{{ item.label }}</li>
  </AnimeTransitionGroup>
</template>
```

- `enterAnimation` / `leaveAnimation` take a style name or Anime.js params.
  Built-in styles: `fade` (default), `slide-up`, `slide-down`, `slide-left`,
  `slide-right`, `scale`, `swap`. Custom ones go in `app.config.ts` under
  `nanime.transitions`.
- `<AnimeTransition>` adds `mode` and `appear`. `<AnimeTransitionGroup>` adds
  `appear`, `tag` (default `'div'`), `moveAnimation` and `absoluteLeave`.
- The group slides the remaining items with Anime.js layout. Give it
  `position: relative`, because leaving items are pinned with
  `position: absolute`.

Details, staggering and custom styles:
[references/transitions.md](references/transitions.md).

## When you are stuck

Don't drop to `onMounted` with raw `animejs` imports, and don't reach for GSAP.
The effect almost always has a nanime path:

| Building | Read |
|---|---|
| Enter/leave, keyed swaps, custom transition styles | [references/transitions.md](references/transitions.md) |
| `v-for` lists: add, remove, reorder, stagger | [references/lists.md](references/lists.md) |
| Position or size changes on mounted elements (FLIP) | [references/use-anime-layout.md](references/use-anime-layout.md) |
| Timelines over split text, SVG draw/morph, scroll | [references/timelines.md](references/timelines.md) |
| Checking an animation without a browser, test setup | [references/verifying.md](references/verifying.md) |

For questions about Anime.js itself (a parameter, a return shape, a util), read
https://animejs.com/documentation. nanime passes those through unchanged.

For nanime's own API, read https://nanimejs.netlify.app/llms-full.txt (every
docs page as plain text), or query the docs MCP server at
https://nanimejs.netlify.app/mcp.

## Aliases

Import helpers from these rather than from `animejs` directly.

| Alias | Holds |
|---|---|
| `#nanime/types` | Anime.js types (`AnimationParams`, `JSAnimation`, `FunctionValue`, …) and `AnimeTransitionStyle` |
| `#nanime/utils` | Anime.js utils (`stagger`, `random`, `shuffle`, `set`, `round`, …), plus `animate` and `createTimer` for handler code |
| `#nanime/easings` | Anime.js easings (`spring`, `cubicBezier`, `steps`, …) |
| `#nanime/proxies` | Everything in the two below |
| `#nanime/proxies/svg` | `createMotionPath`, `createDrawable`, `morphTo` |
| `#nanime/proxies/text` | `scrambleText`, for use inside animation parameters |

These are not auto-imported. Import from the alias.

## Binding one composable to another

Pass a composable's return value straight into another composable's parameters.
nanime resolves it to the underlying Anime.js instance before Anime.js sees it.

```ts
const scroll = useAnimeScroll(() => ({ target: section.value, sync: true }))

useAnimate(box, { x: 400, autoplay: scroll })
```

The same applies to a timeline's `sync()`.

## Failures that produce no error

### Parameters reading a template ref must be a getter

```ts
useAnimeScroll(() => ({ target: section.value }))   // correct
useAnimeScroll({ target: section.value })           // silently wrong
```

A template ref is empty while the component sets up. A plain object is read once
at that moment, so the option arrives empty. Anime.js then falls back to a
default, such as watching the whole document instead of your element. The
animation runs against the wrong thing and nothing reports it. A getter is read
again once the element exists.

Read `.value` yourself. Anime.js resolves no framework refs when it parses
targets, so a ref object resolves to nothing and the option falls back to its
default, which for a scroll observer's `container` and `target` is
`document.body`.

### Never call a composable outside `setup`

```ts
function onClick() {
  useAnimate(box, { x: 100 })   // leaks
}
```

Outside `setup` there is no component instance and no effect scope, so nothing
is ever reverted. Every call adds another live animation. For animations started
from a handler or a per-frame callback, import `animate` from `#nanime/utils`
and keep the handle yourself, cancelling the previous one before starting the
next and reverting on scope dispose.

### One scroll observer drives one animation

An observer holds a single animation, not a list. Giving the same observer to a
second animation takes the slot from the first, which then freezes where it
stopped. Call `useAnimeScroll` once per animation. Observers built from the same
parameters stay in step, because they read the same scroll position.

### Live values do not tick in a template

`{{ animation.progress }}` shows the value from when the instance was created
and never updates. The returned object tracks the instance, not the numbers
changing inside it, which is what stops a sixty-per-second animation from
re-rendering your component. Write the value into your own ref from a callback:

```ts
const progress = ref(0)

useAnimate(box, {
  x: 400,
  onUpdate: self => progress.value = self.progress,
})
```

### `createDrawable` returns an array

```ts
const drawable = computed(() => path.value ? createDrawable(path.value)[0] : null)
```

Take `[0]`. A ref holding an array is not the same as an array of refs, and the
target types do not accept the former.

## Rebuilds

When your reactive target or parameters change, the composable reverts the old
instance and builds a new one. Two consequences:

- The animation restarts by default. Pass `{ keepTime: true }` as the last
  argument so a duration change mid-flight continues rather than restarting.
  Only `useAnimate`, `useAnimeTimeline` and `useScrambleText` accept it. For a
  value that retargets constantly, such as a live counter, use `useAnimatable`.
- Rebuilds are skipped when the new parameters are unchanged, so a getter
  returning a fresh but identical object each tick costs nothing.

## SSR

The composables wait for mount before touching the DOM, so they are safe in
server-rendered pages. Anything you write yourself that reads an element must
make the same check.
