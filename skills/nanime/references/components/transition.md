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
| `enterAnimation` | style name or `AnimationParams` | `'fade'` |
| `leaveAnimation` | style name or `AnimationParams` | `'fade'` |
| `mode` | `'default'`, `'in-out'`, `'out-in'` | `'default'` |
| `appear` | `boolean` | `false` |

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
