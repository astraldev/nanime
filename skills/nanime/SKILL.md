---
name: nanime
description: |
  Build animations in a Nuxt app with nanime, the Nuxt module wrapping Anime.js v4.
  Use when animating elements, text, SVG paths or scroll position in Nuxt: useAnimate,
  useWaapiAnimate, useAnimatable, useAnimeTimeline, useDraggable, useSplitText,
  useScrambleText, useAnimeScroll, and the #nanime/* aliases. Read the failure modes
  below before shipping. Most mistakes here do not throw, they animate the wrong thing.
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

## Aliases

Import helpers from these rather than from `animejs` directly.

| Alias | Holds |
|---|---|
| `#nanime/types` | Every type you need, re-exported |
| `#nanime/utils` | `stagger`, `round`, `set`, and the rest of Anime.js's utils |
| `#nanime/easings` | Easing helpers |
| `#nanime/proxies/svg` | `createMotionPath`, `createDrawable`, `morphTo` |
| `#nanime/proxies/text` | `scrambleText`, for use inside animation parameters |

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

Read `.value` yourself. Anime.js unwraps React and Angular refs but not Vue
ones, so passing the ref itself has the same effect as passing nothing.

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

- The playhead carries over by default, so a duration change mid-flight
  continues rather than restarting. Pass `{ keepTime: false }` as the third
  argument to restart instead.
- Rebuilds are skipped when the new parameters are unchanged, so a getter
  returning a fresh but identical object each tick costs nothing.

## SSR

The composables wait for mount before touching the DOM, so they are safe in
server-rendered pages. Anything you write yourself that reads an element must
make the same check.
