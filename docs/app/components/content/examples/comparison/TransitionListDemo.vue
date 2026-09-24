<script setup lang="ts">
import { random, shuffle } from '#nanime/utils'
import ExampleWrapper, { type ExampleAction } from '~/components/shared/ExampleWrapper.vue'

const items = ref([1, 2, 3, 4, 5])
let nextId = 6

function add() {
  items.value.splice(random(0, items.value.length), 0, nextId++)
}

function remove() {
  items.value.splice(random(0, items.value.length - 1), 1)
}

function shuffleItems() {
  shuffle(items.value)
}

const actions: ExampleAction[] = [
  { label: 'Add', run: add },
  { label: 'Remove', run: remove },
  { label: 'Shuffle', run: shuffleItems },
]
</script>

<template>
  <ExampleWrapper :actions="actions">
    <AnimeTransitionGroup
      tag="ul"
      enter-animation="scale"
      leave-animation="scale"
      class="relative flex min-h-10 flex-wrap gap-2"
    >
      <li
        v-for="item in items"
        :key="item"
        class="flex size-10 items-center justify-center rounded-lg bg-primary font-semibold text-black"
      >
        {{ item }}
      </li>
    </AnimeTransitionGroup>
  </ExampleWrapper>
</template>
