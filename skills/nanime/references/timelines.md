# Timelines fed by other composables and SVG

## Timeline methods can be called in `setup`

`useAnimeTimeline()` returns a buffered proxy. `.add()`, `.set()`, `.label()`,
`.play()` and the rest queue until the timeline exists after mount,
then replay. You don't need `onMounted` or a `watch` for them.

```ts
const { chars } = useSplitText(heading, { chars: true })
const tl = useAnimeTimeline({ autoplay: false })

tl.add(chars, { opacity: [0, 1] }, 0)   // chars is still [] here, which is fine
```

## Helpers that take an element need a real element

Composable targets accept refs. The helpers `createDrawable`, `morphTo` and
`createMotionPath` from `#nanime/proxies/svg` do not. They read `.value` right
away, and in top-level `setup` the ref is still `null`.

```ts
onMounted(() => {
  if (!path.value || !shape.value) return
  const [drawable] = createDrawable(path.value)
  if (!drawable) return
  tl.add(drawable, { draw: ['0 0', '0 1'], duration: 1000 }, 0)
    .add(path.value, { d: morphTo(shape.value), duration: 800 }, 1000)
})
```

Outside a timeline, use the `computed` pattern from SKILL.md instead.

## Scroll-driven timeline

```ts
const scroll = useAnimeScroll(() => ({ target: section.value ?? undefined, sync: true }))
const tl = useAnimeTimeline({ autoplay: scroll })
```

Bind through `autoplay`, which nanime unwraps to the observer. `scroll.link(tl)`
hands Anime.js the proxy itself.

A template ref is `T | null`, but the scroll params accept `T | undefined`. Use
`?? undefined`. Don't use a cast.

## Timing that looks right but traces wrong

These rules come from Anime.js, not nanime, so read the linked pages:

- A staggered `delay` with `from` values leaves the later items at rest until
  each delay starts. Put the start state at position 0 with `tl.set(targets, {...}, 0)`.
  https://animejs.com/documentation/timeline/timeline-methods/set
- A staggered `delay` combined with `loop` and `alternate` inside a timeline
  mistimes the iterations. Stagger the position instead, for example
  `tl.add(targets, params, stagger(30, { start: 1200 }))`.
  https://animejs.com/documentation/utilities/stagger/timeline-positions-staggering
- `loop: n` means n *extra* passes. For "go and come back" with `alternate`, use
  `loop: 1`. https://animejs.com/documentation/animation/animation-playback-settings/loop
