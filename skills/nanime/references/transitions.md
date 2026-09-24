# `<AnimeTransition>` and `<AnimeTransitionGroup>`

Drop-ins for Vue's `<Transition>` and `<TransitionGroup>`. Anime.js runs the
enter, leave and move animations, so write no transition CSS and no
`.v-enter-active` / `.v-move` classes. Both are auto-registered. Vue's
transition events (`@after-enter`, `@after-leave`, …) pass through.

Docs: https://nanimejs.netlify.app/components/transitions and
https://nanimejs.netlify.app/components/transition-styles

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

## Lists: `v-for` with add, remove and reorder

```vue
<template>
  <AnimeTransitionGroup tag="ul" class="relative flex flex-wrap gap-2" enter-animation="scale" leave-animation="scale">
    <li v-for="item in items" :key="item.id">{{ item.label }}</li>
  </AnimeTransitionGroup>
</template>
```

It takes the props above except `mode`, plus:

| Prop | Type | Default |
|---|---|---|
| `tag` | `string` | `'div'` |
| `moveAnimation` | style name, `{ duration, delay, ease }`, or `false` | `{ duration: 400, ease: 'out(3)' }` |
| `absoluteLeave` | `boolean` | `true` |

- Unlike Vue's `<TransitionGroup>`, it always renders a wrapper element
  (`tag`, default `div`). Put the list's layout classes on the group itself.
- Give the group `position: relative`. With `absoluteLeave`, a leaving item
  switches to `position: absolute` against it, so the others close the gap
  while it animates out.
- Moves (reorder, shuffle, the gap closing) use Anime.js layout. Mutate the
  array and the items slide. No `useAnimeLayout` or `patch()` call is needed.
- Every item needs a stable `:key`, such as an id. With an index key,
  removing an item makes the last element leave while the rest swap their
  content in place, so nothing slides.

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

## Styles

Built-ins: `fade`, `slide-up`, `slide-down`, `slide-left`, `slide-right`,
`scale`, `swap`. Inline params beat a name. An unknown name falls back to
the `fade` animation and logs a warning.

Define your own in `app.config.ts`, never `nuxt.config.ts`. A style can set
`enter`, `leave` and `move`, and a style named like a built-in replaces it.
The names autocomplete in the animation props.

```ts
export default defineAppConfig({
  nanime: {
    transitions: {
      pop: {
        enter: { opacity: [0, 1], scale: [0.4, 1], duration: 500, ease: 'outBack(3)' },
        leave: { opacity: 0, scale: 0.4, duration: 250 },
        move: { duration: 300, ease: 'out(3)' },
      },
    },
  },
})
```

Inline params take any Anime.js param, including `keyframes`:

```vue
<AnimeTransition :leave-animation="{ keyframes: [{ x: -8, duration: 80 }, { x: 8, duration: 80 }, { opacity: 0, scale: 1.6, duration: 300 }] }">
  <div v-if="visible" />
</AnimeTransition>
```

## Transition or `useAnimeLayout`?

- Elements entering and leaving, or a `v-for` array changing:
  `<AnimeTransitionGroup>`.
- Elements staying mounted but changing position or size (a class toggle,
  a grid column change, an expanding card): `useAnimeLayout`. See
  [use-anime-layout.md](use-anime-layout.md).
