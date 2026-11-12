# `useAnimate`

Docs: https://nanimejs.netlify.app/composables/use-animate

## Rebuilds restart the animation

When a reactive target or parameter changes, the composable reverts the old
instance and builds a new one, from the start, unless `rebuild` says
otherwise. Unchanged params are skipped, so a getter returning an identical
fresh object costs nothing.

- To continue mid-flight, pass `{ rebuild: 'keepTime' }` as the last
  argument to `useAnimate`, `useAnimeTimeline` or `useScrambleText`.
- To start the new animation from the current values, pass
  `{ rebuild: 'keepValue' }` to `useAnimate`. Add `composition: 'blend'` to
  the parameters to keep the old motion running and blend the new one onto
  it. Without `'keepValue'`, `'blend'` has nothing to blend with, because
  the rebuild reverts the old animation. A looping animation is cancelled
  instead.
- `keepValue` with `blend` keeps one running layer per rebuild until each
  finishes, so a burst of changes inside one `duration` stacks that many
  layers. A finite `loop: n` is layered too, until its loops complete.
- For a value that retargets constantly, use `useAnimatable`.

## Create `stagger()` inside a getter when items can be added

A plain-object `stagger()` works out each item's step the first time it
runs and keeps them, so an item added later gets the first item's step.
Return it from a getter so each rebuild makes a new one:

```ts
// wrong: the stagger keeps the first targets' steps
useAnimate(items, { opacity: [0, 1], delay: stagger(40) })

// right: a getter makes a new stagger on every rebuild
useAnimate(items, () => ({ opacity: [0, 1], delay: stagger(40) }))
```

Docs: https://nanimejs.netlify.app/composables/utilities#stagger-a-list-that-can-grow

## Entrance stagger without a transition group

Target the items through the container ref, not a `v-for` ref array.

```ts
import { stagger } from '#nanime/utils'

const grid = useTemplateRef('grid')

useAnimate(
  () => grid.value ? [...grid.value.querySelectorAll<HTMLElement>('.card')] : [],
  { opacity: [0, 1], translateY: [40, 0], delay: stagger(80, { grid: [4, 3], from: 'center' }) },
)
```

A getter over a `v-for` ref array changes identity whenever the list grows.
That rebuilds the animation, so every card replays. The getter above tracks
only `grid`, which settles once at mount.
