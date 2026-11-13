<script setup lang="ts">
import ExampleWrapper, { type ExampleAction } from '~/components/shared/ExampleWrapper.vue'

const modes = ['default', 'in-out', 'out-in'] as const

const mode = ref<typeof modes[number]>('out-in')
const current = ref('A')

function swap() {
  current.value = current.value === 'A' ? 'B' : 'A'
}

const actions = computed<ExampleAction[]>(() => [
  ...modes.map(value => ({
    label: value,
    run: () => (mode.value = value),
    active: mode.value === value,
  })),
  { label: 'Swap', run: swap },
])
</script>

<template>
  <ExampleWrapper :actions="actions">
    <div class="flex h-14 items-center gap-2">
      <AnimeTransition
        :mode="mode"
        :enter-animation="{ opacity: [0, 1], x: [-24, 0], duration: 600 }"
        :leave-animation="{ opacity: 0, x: 24, duration: 600 }"
      >
        <div
          :key="current"
          class="grid size-12 place-items-center rounded-lg bg-primary font-semibold text-black"
        >
          {{ current }}
        </div>
      </AnimeTransition>
    </div>
  </ExampleWrapper>
</template>
