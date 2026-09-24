<script setup lang="ts">
import ExampleWrapper, { type ExampleAction } from '~/components/shared/ExampleWrapper.vue'

const area = useTemplateRef('area')
const box = useTemplateRef('box')
const snapping = ref(true)

useDraggable(box, {
  container: area,
  y: false,
  snap: () => (snapping.value ? 50 : 0),
})

const actions = computed<ExampleAction[]>(() => [
  {
    label: 'Snap to 50px',
    run: () => (snapping.value = !snapping.value),
    active: snapping.value,
  },
])
</script>

<template>
  <ExampleWrapper
    :actions="actions"
    :status="snapping ? 'snapping on' : 'snapping off'"
  >
    <div
      ref="area"
      class="relative h-24 rounded-lg border border-dashed border-primary/35"
    >
      <div
        aria-hidden="true"
        class="absolute inset-0 pointer-events-none text-primary/60 transition-opacity"
        :class="snapping ? 'opacity-100' : 'opacity-0'"
        :style="{
          backgroundImage: 'radial-gradient(circle, currentColor 3px, transparent 3.5px)',
          backgroundSize: '50px 50px',
          backgroundPosition: '23px 23px',
          backgroundRepeat: 'repeat-x',
        }"
      />
      <div
        ref="box"
        class="size-10 m-7 rounded-lg bg-primary cursor-grab"
      />
    </div>
  </ExampleWrapper>
</template>
