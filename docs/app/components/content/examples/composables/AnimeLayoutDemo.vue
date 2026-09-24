<script setup lang="ts">
import { shuffle } from '#nanime/utils'
import ExampleWrapper, { type ExampleAction } from '~/components/shared/ExampleWrapper.vue'

const list = useTemplateRef('list')
const items = ref([1, 2, 3, 4, 5, 6])

const layout = useAnimeLayout(list, { duration: 600 })

function reverse() {
  layout.patch(() => items.value.reverse())
}

function shuffleItems() {
  layout.patch(() => shuffle(items.value))
}

const actions: ExampleAction[] = [
  { label: 'Reverse', run: reverse },
  { label: 'Shuffle', run: shuffleItems },
]
</script>

<template>
  <ExampleWrapper :actions="actions">
    <ul
      ref="list"
      class="flex flex-wrap gap-2"
    >
      <li
        v-for="item in items"
        :key="item"
        class="flex size-10 items-center justify-center rounded-lg bg-primary font-semibold text-black"
      >
        {{ item }}
      </li>
    </ul>
  </ExampleWrapper>
</template>
