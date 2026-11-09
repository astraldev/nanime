<script setup lang="ts">
import type { AnimationParams } from '#nanime/types'
import { stagger } from '#nanime/utils'
import ExampleWrapper, { type ExampleAction } from '~/components/shared/ExampleWrapper.vue'

const enter: AnimationParams = {
  opacity: [0, 1],
  y: [-48, 0, -12, 0],
  scaleY: [1.3, 0.8, 1.1, 1],
  delay: stagger(60, { from: 'center' }),
  duration: 700,
  ease: 'out(2)',
}

const runs = ref(0)

function replay() {
  runs.value++
}

const actions: ExampleAction[] = [
  { label: 'Replay', run: replay },
]
</script>

<template>
  <ExampleWrapper :actions="actions">
    <AnimeTransitionGroup
      :key="runs"
      appear
      class="relative flex gap-2 pt-12"
      :enter-animation="enter"
    >
      <div
        v-for="item in 8"
        :key="item"
        class="size-8 rounded-lg bg-primary"
      />
    </AnimeTransitionGroup>
  </ExampleWrapper>
</template>
