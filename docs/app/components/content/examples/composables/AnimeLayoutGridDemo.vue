<script setup lang="ts">
import ExampleWrapper, { type ExampleAction } from '~/components/shared/ExampleWrapper.vue'

const row = useTemplateRef('row')
const wide = ref(false)

const layout = useAnimeLayout(row, { duration: 500 })

function toggle() {
  layout.patch(() => (wide.value = !wide.value))
}

const actions: ExampleAction[] = [
  { label: 'Resize', run: toggle },
]
</script>

<template>
  <ExampleWrapper :actions="actions">
    <div
      ref="row"
      class="flex flex-wrap gap-2"
    >
      <div
        v-for="n in 6"
        :key="n"
        class="h-10 rounded-lg bg-primary"
        :class="wide ? 'w-24' : 'w-10'"
      />
    </div>
  </ExampleWrapper>
</template>
