---
seo:
  title: Effortless animations with AnimeJS
  description: Build SSR Safe animations for Nuxt without having to worry about
    targets, hooks and component lifecycle.
---

::u-page-hero
---
orientation: horizontal
---
  ::tabs
    :::tabs-item{icon="i-lucide-eye" label="Preview"}
      ::hero-animation
      ::
    :::

    :::tabs-item{icon="i-lucide-code" label="Template"}
    ```html
    <div class="boxes grid grid-cols-10 place-items-center gap-0.5 absolute inset-0 p-5">
      <div v-for="i in 40" :key="i" class="box size-9 rounded-sm bg-white/40 aspect-square" />
    </div>
    ```

    :::

    :::tabs-item{icon="i-lucide-file-code" label="Script"}
    ```ts
    import { stagger } from '#nanime/utils'

    useAnimate('.boxes > .box', {
      scale: [
        { to: [0, 1.25] },
        { to: 0 }
      ],
      boxShadow: [
        { to: '0 0 1rem 0 currentColor' },
        { to: '0 0 0rem 0 currentColor' }
      ],
      delay: stagger(100, {
        grid: [10, 4],
        from: 'center',
      }),
    })
    ```
    :::
  ::

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

  :::copy-code-input{source="npx nuxi module add nanime"}
  :::
::

::u-page-section
#title
Shipped with many features

#features
  :::u-page-card
  ---
  icon: i-simple-icons-nuxt
  spotlight: true
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
  icon: i-simple-icons-animedotjs
  spotlight: true
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
  icon: i-tabler-server-cog
  spotlight: true
  target: _blank
  to: https://nuxt.com
  ---
  #title
  [SSR]{.text-primary} safe
  
  #description
  Composables doesn't break ssr nor cause hydration issues
  :::

  :::u-page-card
  ---
  icon: i-tabler-settings-bolt
  spotlight: true
  target: _blank
  to: https://nuxt.com/docs/guide/directory-structure/app-config
  ---
  #title
  Customizable
  
  #description
  Enable or disable composables or components
  :::
::
