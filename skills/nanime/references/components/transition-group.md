# `<AnimeTransitionGroup>`

Drop-in for Vue's `<TransitionGroup>`, with the same rules as
[transition.md](transition.md). Style names are in
[transition-styles.md](transition-styles.md).

Docs: https://nanimejs.netlify.app/components/transition-group

## Lists: `v-for` with add, remove and reorder

```vue
<template>
  <AnimeTransitionGroup tag="ul" class="relative flex flex-wrap gap-2" :deps="[]" enter-animation="scale" leave-animation="scale">
    <li v-for="item in items" :key="item.id">{{ item.label }}</li>
  </AnimeTransitionGroup>
</template>
```

It takes the props in [transition.md](transition.md) except `mode`, with its own defaults, plus:

| Prop | Type | Default |
|---|---|---|
| `enterAnimation` | style name or `AnimationParams` | fade in, 250ms `out(3)` |
| `leaveAnimation` | style name or `AnimationParams` | fade out, 150ms `in(3)` |
| `tag` | `string` | `'div'` |
| `moveAnimation` | style name, `{ duration, delay, ease }`, or `false` | `{ duration: 350, ease: 'out(3)' }` |
| `absoluteLeave` | `boolean` | `true` |
| `deps` | `unknown[]` (values or getters) | |
| `shallow` | `boolean` | `false` |

- Unlike Vue's `<TransitionGroup>`, it always renders a wrapper element
  (`tag`). Put the list's layout classes on the group itself.
- Give the group `position: relative`. With `absoluteLeave`, a leaving item
  switches to `position: absolute` against it, so the others close the gap
  while it animates out.
- Moves (reorder, shuffle, the gap closing) use AnimeJS layout. Mutate the
  array and the items slide. No `useAnimeLayout` or `patch()` call is needed.
- Every item needs a stable `:key`, such as an id. With an index key,
  removing an item makes the last element leave while the rest swap their
  content in place, so nothing slides.
- A leave, a move and an enter in the same update all start together. To
  let the new item appear after the others have made room, give the enter
  a `delay` about as long as the leave. The enter's start values apply at
  once, so the item stays hidden while it waits.

### Pass `deps`

Without `deps`, every re-render of the group measures everything inside
it, even when nothing moved. Pass it on every group:

```vue
<AnimeTransitionGroup :deps="[]">       <!-- add, remove, reorder -->
<AnimeTransitionGroup :deps="[view]">   <!-- also when view resizes items -->
```

- Entries are watched deeply. Add `shallow` to react only when an entry is
  replaced.
- Each move measures every element inside the group, down to the text in
  each item. Keep item markup lean.
- Use `:move-animation="false"` when items only enter and leave. The group
  then measures nothing.
- Without `deps`, a value read in the slot that settles after mount, such
  as a template ref passed to each item as a prop, re-renders the group and
  runs a move pass. Pass a getter instead (`:target="() => bin"`).

### Staggering items

`stagger()` works in `enterAnimation` and `leaveAnimation`. Items that
enter, or leave, in the same update are counted together in DOM order, so
the first one starts first:

```vue
<script setup lang="ts">
import { stagger } from '#nanime/utils'
</script>

<template>
  <AnimeTransitionGroup appear :enter-animation="{ opacity: [0, 1], y: [16, 0], delay: stagger(60) }">
    <div v-for="item in items" :key="item.id" />
  </AnimeTransitionGroup>
</template>
```

The count restarts with each update, so one item added later starts with
no delay.

A stagger in `moveAnimation` works differently. Moves run on every element
inside the group, down to the text in each item, so the delay grows with
each nested element rather than each item. An item holding five elements
adds five steps, and the text trails behind its own item. Leave the move
unstaggered for items with content, or keep the step to a few
milliseconds.
