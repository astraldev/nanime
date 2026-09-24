# Animating lists (`v-for`)

## Add, remove, reorder

Wrap the `v-for` in `<AnimeTransitionGroup>`. New items run the enter
animation, removed items the leave animation, and the rest slide to their
new positions. See [transitions.md](transitions.md), including how to
stagger items there.

## Entrance stagger for a list that is not a transition group

Target the items through the container ref, not a `v-for` ref array.

```ts
const grid = useTemplateRef('grid')

useAnimate(
  () => grid.value ? [...grid.value.querySelectorAll<HTMLElement>('.card')] : [],
  { opacity: [0, 1], translateY: [40, 0], delay: stagger(80, { grid: [4, 3], from: 'center' }) },
)
```

`stagger` comes from `#nanime/utils`.

A getter over a `v-for` ref array changes identity whenever the list grows.
That reverts and rebuilds the animation, so every card replays. The getter
above tracks only `grid`, which settles once at mount.

## Animating one item from a handler

A click handler has no effect scope, so calling `useAnimate` there leaks (see
SKILL.md). When a transition group doesn't fit, keep the handle yourself:

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
