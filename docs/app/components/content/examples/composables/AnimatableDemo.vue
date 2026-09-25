<script setup lang="ts">
import { round } from '#nanime/utils'

import ExampleWrapper from '~/components/shared/ExampleWrapper.vue'

const progress = shallowRef(false)
const counter = reactive({ x: 0 })
const animator = useAnimatable(counter, {
  x: 0,
  duration: 1000,
  modifier: round(0),
  ease: 'outElastic',
  onComplete() {
    if (!progress.value) return
    animator.x?.(counter.x + 1, 1000)
  },
})

const actions = computed(() => [
  {
    label: progress.value ? 'Stop' : 'Start',
    run: () => {
      progress.value = !progress.value
      if (progress.value) animator.x?.(counter.x)
    },
  },
])
</script>

<template>
  <ExampleWrapper
    :actions="actions"
    class="font-mono"
  >
    <p>
      Counter: {{ JSON.stringify(counter) }}
    </p>
  </ExampleWrapper>
</template>
