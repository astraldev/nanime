<script setup lang="ts">
import type { AnimeTransitionAnimation } from '#nanime/types'
import { random } from '#nanime/utils'
import ExampleWrapper, { type ExampleAction } from '~/components/shared/ExampleWrapper.vue'

const animation: AnimeTransitionAnimation = {
  enter: {
    x: () => [random(-40, 40), 0],
    y: [60, -6, 0],
    scale: [0.6, 1.04, 1],
    opacity: [0, 1, 1],
    duration: 480,
    ease: 'outQuart',
  },
  leave: {
    x: () => [0, random(-60, 60)],
    y: [0, -8, 70],
    scale: [1, 1.06, 0.6],
    opacity: [1, 1, 0],
    duration: 480,
    ease: 'inOut(2)',
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
