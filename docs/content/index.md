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
  Made for [Nuxt]{.text-primary}

  #description
  Composables and components are auto-imported, and AnimeJS is pre-bundled by Vite
  :::

  :::u-page-card
  ---
  spotlight: true
  icon: i-simple-icons-animedotjs
  spotlightColor: var(--color-primary)
  to: /composables/introduction
  ---
  #title
  Nine [composables]{.text-primary}

  #description
  Animate, WAAPI, animatable, split and scramble text, draggable, timeline, scroll and layout
  :::

  :::u-page-card
  ---
  spotlight: true
  icon: i-ph-swap
  spotlightColor: var(--color-primary)
  to: /components/transitions
  ---
  #title
  Transition [components]{.text-primary} :badge[New]{variant="subtle"}

  #description
  Animate v-if and v-for changes, including list moves, with no CSS to write
  :::

  :::u-page-card
  ---
  spotlight: true
  icon: i-ph-palette
  spotlightColor: var(--color-primary)
  to: /components/transition-styles
  ---
  #title
  Transition [styles]{.text-primary} :badge[New]{variant="subtle"}

  #description
  Seven built-in styles, plus your own with keyframes, filters and springs
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
  Nothing runs on the server, and every animation reverts when its component unmounts
  :::

  :::u-page-card
  ---
  spotlight: true
  icon: i-ph-arrows-clockwise
  spotlightColor: var(--color-primary)
  to: /getting-started/configuration
  ---
  #title
  [Reactive]{.text-primary} parameters

  #description
  Pass a getter and the animation rebuilds whenever a ref inside it changes
  :::

  :::u-page-card
  ---
  spotlight: true
  icon: i-ph-code
  spotlightColor: var(--color-primary)
  to: /composables/use-animate
  ---
  #title
  The real [instance]{.text-primary}

  #description
  Each composable returns the AnimeJS instance, so the AnimeJS docs apply line for line
  :::

  :::u-page-card
  ---
  spotlight: true
  icon: i-ph-robot
  spotlightColor: var(--color-primary)
  to: /getting-started/installation#use-with-ai-agents
  ---
  #title
  Built for [AI agents]{.text-primary} :badge[New]{variant="subtle"}

  #description
  An agent skill, llms.txt and an MCP server, so coding agents get nanime right
  :::

  :::u-page-card
  ---
  spotlight: true
  icon: i-ph-feather
  spotlightColor: var(--color-primary)
  to: /composables/utilities
  ---
  #title
  [Small]{.text-primary}

  #description
  No runtime dependencies beyond AnimeJS and one tiny helper
  :::
::

::u-page-section
:spring-grid-demo

#title
See it in action

#description
Dashboards that rearrange, feeds that grow, panels that open and close. Change your data, and every element springs to its new place.
::
