---
title: nanime
description: Anime.js v4 in SSR-safe Vue composables. Animate, drag, split text, and sync timelines in Nuxt.
seo:
  title: nanime - Anime.js Composables for Nuxt & Vue 3
  description: Anime.js v4 in SSR-safe Vue composables. Animate, drag, split text, and sync timelines in Nuxt.
---

::u-page-hero
---
orientation: horizontal
---
  :::tabs
    ::::tabs-item{icon="i-lucide-eye" label="Preview"}
    :hero-animation
    ::::

    ::::tabs-item{icon="i-lucide-code" label="Template"}
    ```html
    <div class="grid grid-cols-10 place-items-center gap-0.5 absolute inset-0 p-5">
      <div v-for="i in 40" :key="i" ref="boxes" class="size-9 rounded-sm bg-primary/30 aspect-square" />
    </div>
    ```
    ::::

    ::::tabs-item{icon="i-lucide-file-code" label="Script"}
    ```ts
    import { stagger } from '#nanime/utils'

    const boxes = useTemplateRef('boxes')

    useAnimate(boxes, {
      scale: [{ to: [0, 1.25] }, { to: 0 }],
      boxShadow: [
        { to: '0 0 1rem 0 currentColor' },
        { to: '0 0 0rem 0 currentColor' }
      ],
      delay: stagger(100, {
        grid: [10, 4],
        from: 'center',
      }),
      duration: 1500,
      playbackEase: 'outQuad',
      loop: true,
    })
    ```
    ::::
  :::

#title
Animate Nuxt with [AnimeJS]{.text-primary}

#description
Anime.js wrapped in Vue composables. They resolve targets, skip server renders, and clean up on unmount.

#links
  :::u-button
  ---
  icon: i-lucide-arrow-right
  size: xl
  to: /getting-started/installation
  ---
  Get started
  :::

  :::u-button
  ---
  icon: i-ph-shapes
  size: xl
  color: neutral
  variant: subtle
  to: /examples/introduction
  ---
  See examples
  :::

:copy-code-input{source="npx nuxt module add nanime"}
::

::u-page-section
#title
What you get

#features
  :::u-page-card
  ---
  spotlight: true
  icon: i-simple-icons-nuxt
  spotlightColor: var(--color-primary)
  target: _blank
  to: https://nuxt.com
  ---
  #title
  Built with [Nuxt 4]{.text-primary}

  #description
  Composables are auto-imported across your Nuxt app
  :::

  :::u-page-card
  ---
  spotlight: true
  icon: i-simple-icons-animedotjs
  spotlightColor: var(--color-primary)
  target: _blank
  to: https://animejs.com/
  ---
  #title
  Powered by [AnimeJS]{.text-primary}

  #description
  All of Anime.js v4, wrapped directly with Vue reactivity
  :::

  :::u-page-card
  ---
  spotlight: true
  icon: i-tabler-server-cog
  spotlightColor: var(--color-primary)
  target: _blank
  to: https://nuxt.com
  ---
  #title
  [SSR]{.text-primary} safe

  #description
  Nothing runs on the server, so there is no hydration mismatch
  :::

  :::u-page-card
  ---
  spotlight: true
  icon: i-tabler-settings-bolt
  spotlightColor: var(--color-primary)
  target: _blank
  to: https://nuxt.com/docs/guide/directory-structure/app-config
  ---
  #title
  Customizable

  #description
  Use auto-imports, or import from `#nanime/composables`
  :::
::

::u-page-section
#title
Composables

#description
One composable per Anime.js API, with a live demo on each page.

#features
  :::u-page-card
  ---
  spotlight: true
  icon: i-ph-play-circle
  spotlightColor: var(--color-primary)
  to: /composables/use-animate
  ---
  #title
  useAnimate

  #description
  CSS properties, transforms, SVG, and plain JavaScript objects.
  :::

  :::u-page-card
  ---
  spotlight: true
  icon: i-ph-lightning
  spotlightColor: var(--color-primary)
  to: /composables/use-waapi-animate
  ---
  #title
  useWaapiAnimate

  #description
  The Web Animations API, running off the main thread.
  :::

  :::u-page-card
  ---
  spotlight: true
  icon: i-ph-cube
  spotlightColor: var(--color-primary)
  to: /composables/use-animatable
  ---
  #title
  useAnimatable

  #description
  Setters that tween, for values that change many times a second.
  :::

  :::u-page-card
  ---
  spotlight: true
  icon: i-ph-text-t
  spotlightColor: var(--color-primary)
  to: /composables/use-split-text
  ---
  #title
  useSplitText

  #description
  Text as lines, words, or characters, ready to stagger.
  :::

  :::u-page-card
  ---
  spotlight: true
  icon: i-ph-shuffle
  spotlightColor: var(--color-primary)
  to: /composables/use-scramble-text
  ---
  #title
  useScrambleText :badge[New]{variant="subtle"}

  #description
  Scramble and reveal, driven by reactive text.
  :::

  :::u-page-card
  ---
  spotlight: true
  icon: i-ph-hand-grabbing
  spotlightColor: var(--color-primary)
  to: /composables/use-draggable
  ---
  #title
  useDraggable

  #description
  Dragging with snapping, bounds, and axis constraints.
  :::

  :::u-page-card
  ---
  spotlight: true
  icon: i-ph-clock
  spotlightColor: var(--color-primary)
  to: /composables/use-anime-timeline
  ---
  #title
  useAnimeTimeline

  #description
  Several animations on one clock you can play, pause, and scrub.
  :::
::

::u-page-section
#title
The rest of the toolkit

#description
Easings, utilities, and proxies to use inside composable parameters.

#features
  :::u-page-card
  ---
  spotlight: true
  icon: i-ph-chart-line-up
  spotlightColor: var(--color-primary)
  to: /misc/easings
  ---
  #title
  Easings

  #description
  Spring physics and custom cubic Bézier curves.
  :::

  :::u-page-card
  ---
  spotlight: true
  icon: i-ph-wrench
  spotlightColor: var(--color-primary)
  to: /misc/utils
  ---
  #title
  Utils

  #description
  Stagger, snap, lerp, and helpers from `animejs/utils`.
  :::

  :::u-page-card
  ---
  spotlight: true
  icon: i-ph-plugs-connected
  spotlightColor: var(--color-primary)
  to: /misc/proxies
  ---
  #title
  Proxies

  #description
  SVG morphing, motion paths, drawable strokes, and text scrambling.
  :::
::
