<script setup lang="ts">
import { snap } from '#nanime/utils'
import type { AnimationParams } from '#nanime/types'
import ExampleWrapper from '~/components/shared/ExampleWrapper.vue'

const defaults: AnimationParams = {
  x: { to: 300 },
  duration: 3000,
  loop: true,
  alternate: true,
  ease: 'outBack',
}

useAnimate('.normal', defaults)
useAnimate('.snapped', {
  ...defaults,
  modifier: snap(30),
})
</script>

<template>
  <div class="flex gap-4 flex-col">
    <ExampleWrapper>
      <div class="simple-box normal w-8" />
    </ExampleWrapper>
    <ExampleWrapper>
      <div class="simple-box snapped w-8" />
    </ExampleWrapper>
  </div>
</template>
