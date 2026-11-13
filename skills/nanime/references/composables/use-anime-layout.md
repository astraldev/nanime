# `useAnimeLayout`

For the component version and the comparison with `<AnimeTransitionGroup>`, see
[layout-group.md](../components/layout-group.md).

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
  `patch` snapshots positions, runs the callback (sync or async), waits for
  Vue to update the DOM, then animates. It returns the Anime.js timeline, so
  `await` resolves when the animation finishes.
- The optional second argument overrides the timing for that call.
- Call `patch` from handlers or watchers, after mount.
- Don't use Anime.js `layout.update(callback)` for Vue state. It animates
  before Vue has patched the DOM, so nothing moves.
- The options are reactive. A change in value rebuilds the layout, so keep
  them stable while an animation runs.
- When the change can't go in one callback: `layout.record()`, change state,
  `await nextTick()`, `layout.animate()`, in that order.

Docs: https://nanimejs.netlify.app/composables/use-anime-layout


## Very large scenes

`createLayout()` walks every descendant of its root on each update. When a
layout holds hundreds of elements and the cost shows up as jank, patch the
installed Anime.js so it measures only the named targets, their ancestors and
the siblings of both: see [patch-animejs-tracked-layout](../../../patch-animejs-tracked-layout/SKILL.md).
It is an install patch, not a nanime option, and it keeps the same public API.
