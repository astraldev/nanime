<template>
  <div
    ref="wrapper"
    class="h-40 w-sm rounded-lg border border-dashed border-gray-800 grid grid-flow-col place-items-center bg-gray-200/5"
  >
    <div
      v-for="i in 3"
      :key="i"
      ref="square"
      class="square size-10 bg-white/50 rounded-md"
    />
  </div>
</template>

<script setup lang="ts">
import { stagger } from 'animejs'

useAnimate(useTemplateRef('square'), {
  y: [
    { to: '-2.75rem', ease: 'outExpo', duration: 600 },
    { to: 0, ease: 'outBounce', duration: 800, delay: 100 },
  ],
  // Property specific parameters
  rotate: {
    from: '-1turn',
    delay: 0,
  },
  delay: stagger(350),
  ease: 'inOutCirc',
  loopDelay: 1000,
  loop: true,
})
</script>
