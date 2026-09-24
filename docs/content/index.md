---
title: nanime
description: Anime.js v4 as SSR-safe Vue composables for Nuxt. Animate, drag, split text, scroll and sync timelines, auto-imported and cleaned up on unmount
seo:
  title: Anime.js Composables for Nuxt and Vue 3
  description: Anime.js v4 as SSR-safe Vue composables for Nuxt. Animate, drag, split text, scroll and sync timelines, auto-imported and cleaned up on unmount
---

::u-page-hero
---
orientation: horizontal
---
  :::render-code-block-preview{:code='false' src="examples/misc/HeroDemo.vue"}
  :::

#title
Anime.js composables for [Nuxt]{.text-primary}

#description
AnimeJS wrapped in Vue composables. They resolve targets, skip server renders, and clean up on unmount.

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
  color: neutral
  icon: i-ph-shapes
  size: xl
  to: /examples/introduction
  variant: subtle
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
  to: /getting-started/installation
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
  All of AnimeJS v4, wrapped directly with Vue reactivity
  :::

  :::u-page-card
  ---
  spotlight: true
  icon: i-tabler-server-cog
  spotlightColor: var(--color-primary)
  to: /composables/introduction
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
  to: /getting-started/configuration
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
One composable per AnimeJS API, with a live demo on each page.

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

  :::u-page-card
  ---
  spotlight: true
  icon: i-ph-mouse-scroll
  spotlightColor: var(--color-primary)
  to: /composables/use-anime-scroll
  ---
  #title
  useAnimeScroll :badge[New]{variant="subtle"}

  #description
  Drive an animation from scroll position.
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
