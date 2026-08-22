---
title: nanime
description: Nuxt module wrapping Anime.js v4 in SSR-safe Vue composables. Animate, drag, split and scramble text, and sync timelines without lifecycle headaches.
seo:
  title: nanime - Anime.js Composables for Nuxt & Vue 3
  description: Nuxt module wrapping Anime.js v4 in SSR-safe Vue composables. Animate, drag, split and scramble text, and sync timelines without lifecycle headaches.
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
Effortless animations with [AnimeJS]{.text-primary}

#description
Create SSR Safe animations for Nuxt without having to worry about targets and component lifecycle.

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
Shipped with many features

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
  Created with nuxt for nuxt
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
  Animation engine by `animejs`
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
  Composables don't break SSR or cause hydration issues
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
  Enable or disable composables
  :::
::

::u-page-section
#title
Composables

#description
Ready-to-use wrappers around every AnimeJS utility, built for Vue reactivity.

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
  Core animation — CSS properties, transforms, SVG, and JS objects.
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
  Web Animations API — hardware-accelerated, off-main-thread animations.
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
  Imperative property setters with built-in transitions.
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
  Split text into lines, words, and characters for staggered animations.
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
  Text scramble and reveal effects with reactive text cycling.
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
  Drag interactions with snap, bounds, and axis constraints.
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
  Sequence and sync multiple timelines into one master composition, with full playback controls.
  :::
::

::u-page-section
#title
The rest of the toolkit

#description
Easing curves, re-exported Anime.js utilities, and SVG/text proxies —
the pieces that show up inside the composables above rather than standing
on their own.

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
  Spring physics and custom cubicBezier curves, used throughout the showcase examples above.
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
  Stagger, targets, and other helpers re-exported directly from `animejs/utils`.
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
  SVG morphing, motion paths, drawable strokes, and the text-scramble proxy.
  :::
::
