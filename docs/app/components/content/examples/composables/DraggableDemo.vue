<script setup lang="ts">
import ExampleWrapper, { type ExampleAction } from '~/components/shared/ExampleWrapper.vue'

const steps = [24, 48, 96]

const track = useTemplateRef('track')
const box = useTemplateRef('box')
const step = ref(48)

useDraggable(box, {
  container: track,
  x: { snap: step },
  y: false,
})

const actions = computed<ExampleAction[]>(() => steps.map(value => ({
  label: `snap ${value}px`,
  run: () => (step.value = value),
  active: step.value === value,
})))
</script>

<template>
  <ExampleWrapper
    :actions="actions"
    :resizable="false"
  >
    <div
      ref="track"
      class="relative h-10 w-72 bg-[linear-gradient(to_right,currentColor_1px,transparent_1px)] text-primary/40"
      :style="{ backgroundSize: `${step}px 100%`, backgroundPosition: '20px 0' }"
    >
      <div
        ref="box"
        class="relative size-10 cursor-grab rounded-lg bg-primary"
      />
    </div>
  </ExampleWrapper>
</template>
