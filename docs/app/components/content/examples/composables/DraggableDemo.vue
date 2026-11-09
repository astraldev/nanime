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

const ticks = computed(() => Array.from({ length: Math.floor(248 / step.value) + 1 }, (_, index) => index * step.value))

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
      class="relative h-10 w-72"
    >
      <span
        v-for="tick in ticks"
        :key="tick"
        class="absolute inset-y-0 w-px bg-primary/40"
        :style="{ left: `${tick}px` }"
      />
      <div
        ref="box"
        class="relative size-10 cursor-grab rounded-lg bg-primary"
      />
    </div>
  </ExampleWrapper>
</template>
