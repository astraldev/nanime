<script setup lang="ts">
import ExampleWrapper, { type ExampleAction } from '~/components/shared/ExampleWrapper.vue'

const distances = [80, 200]

const box = useTemplateRef('box')
const distance = ref(80)

useAnimate(box, () => ({
  x: distance.value,
  duration: 800,
  ease: 'inOutQuad',
  alternate: true,
  loop: true,
}))

const actions = computed<ExampleAction[]>(() => distances.map(value => ({
  label: `${value}px`,
  run: () => (distance.value = value),
  active: distance.value === value,
})))
</script>

<template>
  <ExampleWrapper
    :actions="actions"
    :status="`x: ${distance}`"
  >
    <div
      ref="box"
      class="size-10 rounded-lg bg-primary"
    />
  </ExampleWrapper>
</template>
