<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { useAnimate } from '../../src/runtime/app/composables/useAnimate'
import type { NanimeInstanceOptions } from '../../src/runtime/app/public/types'

const props = defineProps<{ options?: NanimeInstanceOptions }>()

const distance = ref(100)
const target = { x: 0 }
const progress = ref(-1)

const animation = useAnimate(
  target,
  () => ({ x: distance.value, duration: 1000, autoplay: false }),
  props.options,
)

async function rebuild() {
  animation.seek(500)
  distance.value = 200
  await nextTick()
  progress.value = animation.progress
}
</script>

<template>
  <div>
    <button @click="rebuild">
      rebuild
    </button>
    <span data-test="progress">{{ progress }}</span>
  </div>
</template>
