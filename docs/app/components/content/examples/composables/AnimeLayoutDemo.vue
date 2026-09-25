<script setup lang="ts">
import ExampleWrapper, { type ExampleAction } from '~/components/shared/ExampleWrapper.vue'

const arrangements = {
  row: 'flex gap-2',
  column: 'flex flex-col gap-2',
  grid: 'grid grid-cols-2 gap-2',
}

type Arrangement = keyof typeof arrangements

const container = useTemplateRef('container')
const arrangement = ref<Arrangement>('row')

const layout = useAnimeLayout(container, { duration: 600 })

function arrange(next: Arrangement) {
  layout.patch(() => (arrangement.value = next))
}

function arrangeAction(name: Arrangement): ExampleAction {
  return { label: name, run: () => arrange(name), active: arrangement.value === name }
}

const actions = computed<ExampleAction[]>(() => [
  arrangeAction('row'),
  arrangeAction('column'),
  arrangeAction('grid'),
])
</script>

<template>
  <ExampleWrapper :actions="actions">
    <div
      ref="container"
      class="w-fit"
      :class="arrangements[arrangement]"
    >
      <div
        v-for="n in 4"
        :key="n"
        class="flex size-10 items-center justify-center rounded-lg bg-primary font-semibold text-black"
      >
        {{ n }}
      </div>
    </div>
  </ExampleWrapper>
</template>
