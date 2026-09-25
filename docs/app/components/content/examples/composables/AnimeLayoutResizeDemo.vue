<script setup lang="ts">
import ExampleWrapper, { type ExampleAction } from '~/components/shared/ExampleWrapper.vue'

const row = useTemplateRef('row')
const expanded = ref(1)

const layout = useAnimeLayout(row, { duration: 500 })

function expandNext() {
  layout.patch(() => (expanded.value = (expanded.value % 5) + 1))
}

const actions: ExampleAction[] = [
  { label: 'Next', run: expandNext },
]
</script>

<template>
  <ExampleWrapper :actions="actions">
    <div
      ref="row"
      class="flex flex-wrap items-start gap-2"
    >
      <div
        v-for="n in 5"
        :key="n"
        class="rounded-lg bg-primary"
        :class="expanded === n ? 'h-20 w-32' : 'size-10'"
      />
    </div>
  </ExampleWrapper>
</template>
