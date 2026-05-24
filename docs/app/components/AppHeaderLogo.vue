<script setup lang="ts">
import { scrambleText } from '#nanime/proxies/text'

const text = useTemplateRef('text')

const tl = useAnimeTimeline({
  loop: true,
  autoplay: true,
  ease: 'outElastic(1, .5)',
  duration: 60_000,
  defaults: { delay: 5000 },
})

const animation = useAnimate(text, {
  ease: 'outSine',
  color: [
    'var(--hex-red-1)',
    'var(--hex-green-1)',
    'var(--hex-cyan-1)',
    'var(--hex-indigo-1)',
  ],
})

tl
  // Start at nanime
  .add(text, {
    innerHTML: scrambleText({
      text: 'nanime',
      chars: 'braille',
      cursor: '_',
    }),
  })
  // slight delay
  .add({ duration: 2500 })
  // nanime → nuxt
  .add(text, {
    innerHTML: scrambleText({
      text: 'nuxt',
      chars: 'shades',
    }),
  })
  // slight delay
  .add({ duration: 2500 })
  // nuxt → nuxt+animejs
  .add(text, {
    innerHTML: scrambleText({
      text: 'nuxt+animejs',
      chars: 'symbols',
    }),
  })
  // slight delay
  .add({ duration: 2500 })
  // nuxt+animejs → animejs
  .add(text, {
    innerHTML: scrambleText({
      text: 'animejs',
      chars: 'blocks',
    }),
  })

tl.sync(animation)
</script>

<template>
  <div class="relative flex items-center font-semibold">
    <span ref="text">nanime</span>
  </div>
</template>
