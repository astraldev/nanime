<script setup lang="ts">
import type { AnimeTransitionAnimation } from '#nanime/types'
import { random } from '#nanime/utils'
import ExampleWrapper, { type ExampleAction } from '~/components/shared/ExampleWrapper.vue'

const animation: AnimeTransitionAnimation = {
  enter: {
    scaleX: [0, 1.25, 0.9, 1],
    scaleY: [0, 0.7, 1.1, 1],
    duration: 450,
    ease: 'out(2)',
  },
  leave: {
    x: () => [0, random(-40, 40), random(-180, 180)],
    y: () => [0, -30, random(40, 120)],
    rotate: () => [0, random(-20, 20), random(-120, 120)],
    opacity: [1, 1, 0],
    duration: 600,
    ease: 'in(2)',
  },
}

const visible = ref(true)

const actions = computed<ExampleAction[]>(() => [
  { label: 'Show', run: () => (visible.value = true), active: visible.value },
  { label: 'Hide', run: () => (visible.value = false), active: !visible.value },
])
</script>

<template>
  <ExampleWrapper :actions="actions">
    <div class="grid h-16 place-items-center">
      <AnimeTransition :animation="animation">
        <div
          v-if="visible"
          class="size-12 rounded-lg bg-primary"
        />
      </AnimeTransition>
    </div>
  </ExampleWrapper>
</template>
