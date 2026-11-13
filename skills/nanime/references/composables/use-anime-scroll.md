# `useAnimeScroll`

Docs: https://nanimejs.netlify.app/composables/use-anime-scroll

## Parameters that read a template ref must be a getter

```ts
useAnimeScroll(() => ({ target: section.value ?? undefined }))   // correct
useAnimeScroll({ target: section.value })                        // silently wrong
```

A template ref is `null` during setup. A plain object is read once, then, so
Anime.js falls back to a default, such as watching `document.body` instead of
your element. A getter is read again once the element exists.

Read `.value` yourself: Anime.js does not unwrap Vue refs inside parameters.
Template refs are `T | null` while most params take `T | undefined`, so use
`?? undefined`, not a cast.

## One observer drives one animation

Pass the returned observer straight in as `autoplay`. nanime unwraps it to
the Anime.js instance:

```ts
const scroll = useAnimeScroll(() => ({ target: section.value ?? undefined, sync: true }))
useAnimate(box, { x: 400, autoplay: scroll })
```

Handing one observer to a second animation steals it from the first, which
freezes. Call `useAnimeScroll` once per animation. Observers with the same
params stay in step.

Do not call AnimeJS `onScroll()` inside a parameters getter either. A
getter is read several times per rebuild, and each read builds a new
observer. Create the observer once, outside the getter, or use
`useAnimeScroll`. A scroll-driven timeline is in
[use-anime-timeline.md](use-anime-timeline.md).
