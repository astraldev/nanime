<script setup lang="ts">
import type { AnimationParams } from '#nanime/types'
import ExampleWrapper, { type ExampleAction } from '~/components/shared/ExampleWrapper.vue'

const show = ref(true)

const hopShakeExplode: AnimationParams = {
  keyframes: [
    { y: -24, duration: 180, ease: 'out(3)' },
    { y: 0, duration: 150, ease: 'in(3)' },
    { y: -16, duration: 150, ease: 'out(3)' },
    { y: 0, duration: 130, ease: 'in(3)' },
    { x: -8, duration: 70 },
    { x: 8, duration: 90 },
    { x: 0, duration: 70 },
    { scale: 2, opacity: 0, filter: ['blur(0px)', 'blur(10px)'], duration: 400, ease: 'out(3)' },
  ],
}

function explode() {
  show.value = false
}

function restore() {
  show.value = true
}

const actions: ExampleAction[] = [
  { label: 'Explode', run: explode },
  { label: 'Restore', run: restore },
]
</script>

<template>
  <ExampleWrapper
    :actions="actions"
    :resizable="false"
  >
    <div class="flex h-20 items-end">
      <AnimeTransition
        enter-animation="scale"
        :leave-animation="hopShakeExplode"
      >
        <div
          v-if="show"
          class="size-12 rounded-lg bg-primary"
        />
      </AnimeTransition>
    </div>
  </ExampleWrapper>
</template>
