---
title: nanime
description: 'Anime.js v4 for Nuxt: SSR-safe, auto-imported composables and transitions for animation, scroll, drag and text'
seo:
title: Anime.js Composables for Nuxt and Vue 3
description: 'Anime.js v4 for Nuxt: SSR-safe, auto-imported composables and transitions for animation, scroll, drag and text'
---

::home-particles
::

::home-hero{eyebrow="AnimeJS v4 for Nuxt and Vue" title="Anime.js composables for Nuxt" pitch="Call AnimeJS from setup() with no onMounted, no cleanup and no imports. Animations wait for the element to mount and revert when the component unmounts." install="npx nuxi module add nanime"}
:::u-button{to="/getting-started/installation" size="lg"}
Get started
:::

:::u-button{to="/composables/introduction" size="lg" color="neutral" variant="outline"}
Browse the API
:::
::

::home-section{label="Foundations"}
:::home-cards
::::home-card{name="Works with Nuxt and Vue" to="/guides/vue" icons="i-simple-icons-nuxt i-simple-icons-vuedotjs"}
Auto-imported in Nuxt, or install the same composables and components in a plain Vue 3 app. Nothing runs on the server.
::::

::::home-card{name="Built on AnimeJS v4" to="https://animejs.com" icons="i-simple-icons-animedotjs" external}
Each composable returns the real AnimeJS instance, so the AnimeJS documentation applies line for line.
::::
:::
::

::home-section{label="Get running" title="Your first animation" why="Call a composable from any component. No imports needed."}
:::home-cards
```ts [app.vue]
const box = useTemplateRef('box')
useAnimate(box, { x: 200, alternate: true, loop: true })
```

::::home-preview
::::
:::
::

::home-section{label="Animate and transition" title="Animations that follow your component" why="No onMounted and no cleanup. Animations wait for the element and revert on unmount, and v-if, v-for and list moves animate with a built-in style." to="/composables/introduction" link-label="All composables"}
:::home-cards
::::home-card{name="useAnimate" to="/composables/use-animate"}
One animation on a ref, rebuilt when its parameters change.
::::

::::home-card{name="useAnimeTimeline" to="/composables/use-anime-timeline"}
Sequence several animations on a single timeline.
::::

::::home-card{name="<AnimeTransition />" to="/components/transitions"}
Enter and leave for v-if and v-show.
::::

::::home-card{name="<AnimeTransitionGroup />" to="/components/transition-group"}
Enter, leave and move for v-for lists.
::::
:::
::

::home-section{label="AI agents" title="Built for AI agents" why="Install the agent skill or connect the MCP server, and coding agents write nanime code instead of raw AnimeJS." to="/getting-started/installation#use-with-ai-agents" link-label="Use with AI agents"}
::
