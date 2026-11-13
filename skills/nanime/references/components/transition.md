# `<AnimeTransition>`

Drop-in for Vue's `<Transition>`. Anime.js runs the enter and leave animations,
so write no transition CSS and no `.v-enter-active` classes. Vue's transition
events (`@after-enter`, `@after-leave`, ...) pass through.

For elements that stay mounted but change position or size, use
[layout-group.md](layout-group.md) instead. Style names and custom styles are in
[transition-styles.md](transition-styles.md).

Docs: https://nanimejs.netlify.app/components/transition

## One element: `v-if`, `v-show` or a changed `key`

```vue
<template>
  <AnimeTransition enter-animation="slide-up" leave-animation="fade">
    <div v-if="open" class="panel" />
  </AnimeTransition>

  <AnimeTransition mode="out-in" enter-animation="swap" leave-animation="swap">
    <span :key="status">{{ status }}</span>
  </AnimeTransition>
</template>
```

| Prop | Type | Default |
|---|---|---|
| `animation` | style name (sets both) or `{ enter, leave }` | `'fade'` |
| `enterAnimation` | style name or `AnimationParams` | from `animation` |
| `leaveAnimation` | style name or `AnimationParams` | from `animation` |
| `mode` | `'default'`, `'in-out'`, `'out-in'` | `'default'` |
| `appear` | `boolean` | `false` |
| `waapi` | `boolean` | `false` |

`enterAnimation` and `leaveAnimation` win over their part of `animation`:
`animation="fade" enter-animation="scale"` enters with `scale` and leaves
with `fade`.

Add `waapi` for `transform` and `opacity` transitions that must stay smooth
during hydration. Enter and leave then run on `waapi.animate()` off the main
thread, and the animation props take `waapi.animate()` params. A style
`waapi.animate()` can't run (keyframe objects, function values other than
`ease`, `modifier`, most callbacks) falls back to `animate()` with a dev
warning.

Use `mode="out-in"` for keyed swaps. Otherwise both elements are in the DOM
at once and the new one pushes the old one aside.

For a crossfade, keep the default mode and stack the two elements in one
grid cell: make the wrapper a `grid` and give the keyed child
`col-start-1 row-start-1`. The old one's leave and the new one's enter then
run together in the same spot. No fixed size or `absolute` is needed: the
wrapper takes the taller of the two while both are mounted, and the new
one's size once the leave ends.

```vue
<template>
  <div class="grid">
    <AnimeTransition :enter-animation="{ opacity: [0, 1], duration: 400 }" :leave-animation="{ opacity: 0, duration: 400 }">
      <img :key="track.id" :src="track.cover" class="col-start-1 row-start-1">
    </AnimeTransition>
  </div>
</template>
```
