# `useAnimeLayout`: animate position and size with `patch()`

For `v-for` items entering, leaving or reordering, use
`<AnimeTransitionGroup>` first ([transitions.md](transitions.md)). It needs
no calls at all. Reach for `useAnimeLayout` when elements change position or
size without the list changing: a class toggle, a grid column count, a card
expanding, or a reorder you want to `await`.

Docs: https://nanimejs.netlify.app/composables/use-anime-layout

```ts
const list = useTemplateRef('list')
const layout = useAnimeLayout(list, { duration: 500, ease: 'inOutQuad' })

async function reverse() {
  await layout.patch(() => items.value.reverse())
}

async function toggleWide() {
  await layout.patch(() => {
    wide.value = !wide.value
  }, { duration: 300 })
}
```

- Pass the container, not the items. Its children are recorded and animated.
- Put every state change that moves elements inside the `patch` callback.
  `patch` snapshots positions first, runs the callback (sync or async), waits
  for Vue to update the DOM, then animates. It returns the Anime.js timeline,
  so `await` resolves when the animation finishes.
- The optional second argument overrides the layout's timing for that call.
- Don't use Anime.js `layout.update(callback)` for Vue state. It animates
  before Vue has patched the DOM, so nothing moves. It still works for direct
  DOM changes such as `appendChild`.
- The return value is a buffered proxy over Anime.js's `AutoLayout` plus
  `patch`. Call `patch` from handlers or watchers, after mount.
- The options are reactive. A change in value rebuilds the layout, so keep
  them stable while an animation runs.
- Layout options (`children`, `enterFrom`, `leaveTo`, `swapAt`, …):
  https://animejs.com/documentation/layout

Fallback when the change can't go in one callback: `layout.record()`, change
state, `await nextTick()`, `layout.animate()`, in that order.
