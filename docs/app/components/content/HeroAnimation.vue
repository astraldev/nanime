<script setup lang="ts">
import { stagger } from 'animejs/utils'

useAnimate('.boxes > .box', {
  scale: [
    { to: [0, 1.25] },
    { to: 0 },
  ],
  boxShadow: [
    { to: '0 0 1rem 0 currentColor' },
    { to: '0 0 0rem 0 currentColor' },
  ],
  delay: stagger(100, {
    grid: [10, 4],
    from: 'center',
  }),
  duration: 600,
  loop: true,
})
</script>

<template>
  <div class="p-8 flex items-center h-64 relative isolate bg-(--hex-bg-1) rounded-lg">
    <div class="grid-wrapper boxes">
      <div
        v-for="i in 40"
        :key="i"
        class="box"
      />
    </div>
    <div class="grid-wrapper">
      <div
        v-for="i in 40"
        :key="i"
        class="box"
      />
    </div>
  </div>
</template>

<style scoped>
@reference "~/assets/css/main.css";

.grid-wrapper {
  @apply grid grid-cols-10 place-items-center gap-0.5 absolute inset-0 p-5;
}

.box {
  @apply size-9 rounded-sm bg-white/40 aspect-square;
}
</style>
