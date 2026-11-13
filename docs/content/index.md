---
title: nanime
description: 'Anime.js v4 for Nuxt: SSR-safe, auto-imported composables and transitions for animation, scroll, drag and text'
seo:
  title: Anime.js Composables for Nuxt and Vue 3
---

::home-particles
::

::home-hero
---
eyebrow: AnimeJS v4 for Nuxt and Vue
install: pnpx nuxt module add nanime
pitch: Use AnimeJS functions and utilities directly in component setup without using onMounted and other lifecycle hooks.
title: Anime.js composables for Nuxt
---
  :::u-button{size="lg" to="/getting-started/installation"}
  Get started
  :::

  :::u-button
  ---
  size: lg
  to: /composables/introduction
  color: neutral
  variant: outline
  ---
  Browse the API
  :::
::

::home-section{label="Animate with ease" title="Simple, declarative animation definitions" why="Call a composable, with the template ref as your target, and bind your animation params"}
  :::home-animate-demo
  ```vue
  <script setup lang="ts">
  const box = useTemplateRef('box')
  
  useAnimate(box, { x: 160, alternate: true, loop: true })
  </script>
  
  <template>
    <div ref="box" class="size-8 bg-(--current-color)" />
  </template>
  ```
  :::
::

::home-section{label="Drop in transitions" title="Drop in Transition and TransitionGroup components" why="Easily add flare and style to your transitions"}
  :::home-transition-demo
  ```vue
  const hop = { enter: { ... }, leave: { ... } }
  
  <AnimeTransition :animation="hop">
    <div v-if="open" />
  </AnimeTransition>
  ```
  :::
::

::home-section
---
label: What's in the box?
title: Ten composables, three components
why: A composable for each AnimeJS API, an experimental native timeline, and components that animate v-if, v-for and layout changes
link-label: All composables
to: /composables/introduction
---
  :::home-cards
    ::::home-card{name="useAnimate" to="/composables/use-animate"}
    Animate elements using refs, CSS targets with dynamic properties and keyframes
    ::::

    ::::home-card{name="useWaapiAnimate" to="/composables/use-waapi-animate"}
    Animate with the Web Animations API for simple animations off the main thread
    ::::

    ::::home-card{name="useAnimatable" to="/composables/use-animatable"}
    Smoothly follow a changing value, like a cursor or a meter
    ::::

    ::::home-card{name="useAnimeTimeline" to="/composables/use-anime-timeline"}
    Sequence several animations on one timeline
    ::::

    ::::home-card{name="useWaapiTimeline" to="/composables/use-waapi-timeline"}
    Sequence CSS tweens on the browser's own animation clock (experimental)
    ::::

    ::::home-card{name="useSplitText" to="/composables/use-split-text"}
    Split text into characters, words or lines, then animate each piece
    ::::

    ::::home-card{name="useScrambleText" to="/composables/use-scramble-text"}
    Scramble text into a new string
    ::::

    ::::home-card{name="useDraggable" to="/composables/use-draggable"}
    Make elements draggable, with snapping, release physics and bounds
    ::::

    ::::home-card{name="useAnimeScroll" to="/composables/use-anime-scroll"}
    Drive an animation from scroll progress
    ::::

    ::::home-card{name="useAnimeLayout" to="/composables/use-anime-layout"}
    Animate elements to their next layout when a property or dependency changes
    ::::

    ::::home-card{name="<AnimeTransition />" to="/components/transition"}
    Animate elements entering and leaving with `v-if` and `v-show`
    ::::

    ::::home-card{name="<AnimeTransitionGroup />" to="/components/transition-group"}
    Animate list items entering, leaving and moving in a `v-for`
    ::::

    ::::home-card{name="<AnimeLayoutGroup />" to="/components/layout-group"}
    A component form of `useAnimeLayout` that animates its children's layout changes
    ::::
  :::
::

::home-section
---
label: AI agents
title: Built for AI agents
why: Install the agent skill or connect the MCP server to improve code writing and performance
link-label: Use with AI agents
to: /getting-started/installation#use-with-ai-agents
---
  :::home-cards
    ::::home-card{name="Agent skill" to="/getting-started/installation#use-with-ai-agents"}
    Teaches your coding agent the composables and transition components. Install:
    
    ```
    npx skills add astraldev/nanime --skill nanime
    ```
    ::::
  
    ::::home-card{name="Docs MCP server" to="/getting-started/installation#use-with-ai-agents"}
    Lets your agent search these docs on its own. Connect:
    
    ```
    claude mcp add --transport http nanime https://nanimejs.netlify.app/mcp
    ```
    ::::
  :::
::
