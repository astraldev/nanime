<script setup lang="ts">
import ExampleWrapper from '~/components/shared/ExampleWrapper.vue'

const open = ref(true)

const hop = {
  enter: {
    y: [
      { from: 30, to: -36, duration: 260, ease: 'outQuad' },
      { to: 0, duration: 300, ease: 'inQuad' },
    ],
    scaleX: [
      { from: 1.2, to: 0.9, duration: 260, ease: 'outQuad' },
      { to: 1, duration: 300 },
      { to: 1.2, duration: 80, ease: 'outQuad' },
      { to: 1, duration: 260, ease: 'outElastic(1, .5)' },
    ],
    scaleY: [
      { from: 0.7, to: 1.15, duration: 260, ease: 'outQuad' },
      { to: 1, duration: 300 },
      { to: 0.75, duration: 80, ease: 'outQuad' },
      { to: 1, duration: 260, ease: 'outElastic(1, .5)' },
    ],
    opacity: { from: 0, duration: 140 },
  },
  leave: {
    y: [
      { to: 0, duration: 140 },
      { to: -56, duration: 280, ease: 'outQuad' },
    ],
    scaleX: [
      { to: 1.2, duration: 140, ease: 'outQuad' },
      { to: 0.85, duration: 120, ease: 'outQuad' },
      { to: 0.9, duration: 160 },
    ],
    scaleY: [
      { to: 0.7, duration: 140, ease: 'outQuad' },
      { to: 1.2, duration: 120, ease: 'outQuad' },
      { to: 1.1, duration: 160 },
    ],
    opacity: { to: 0, delay: 160, duration: 260 },
  },
}
</script>

<template>
  <ExampleWrapper
    :actions="[{ label: open ? 'Leave' : 'Enter', run: () => (open = !open) }]"
    :resizable="false"
    class="h-full justify-between"
  >
    <div class="grid flex-1 place-items-end justify-center pb-2">
      <AnimeTransition :animation="hop">
        <div
          v-if="open"
          class="size-12 origin-bottom rounded-lg bg-primary"
        />
      </AnimeTransition>
    </div>
  </ExampleWrapper>
</template>
