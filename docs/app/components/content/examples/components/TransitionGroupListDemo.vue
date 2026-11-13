<script setup lang="ts">
import type { AnimeTransitionGroupAnimation } from '#nanime/types'
import { spring } from '#nanime/easings'
import { random, stagger } from '#nanime/utils'
import ExampleWrapper, { type ExampleAction } from '~/components/shared/ExampleWrapper.vue'

const animation: AnimeTransitionGroupAnimation = {
  enter: {
    scale: [0.2, 1.1, 1],
    rotate: () => [random(-90, 90), 0],
    opacity: [0, 1, 1],
    delay: stagger(50),
    duration: 500,
  },
  leave: { scale: 0.2, opacity: 0, delay: stagger(50), duration: 300 },
  move: { ease: spring({ bounce: 0.3, duration: 600 }) },
}

const tiles = ref([0, 1, 2, 3, 4, 5, 6, 7])
const columns = ref(4)
let nextId = 8

function add() {
  tiles.value.splice(random(0, tiles.value.length), 0, nextId++, nextId++, nextId++)
}

function remove() {
  tiles.value.splice(random(0, Math.max(0, tiles.value.length - 3)), 3)
}

function toggleColumns() {
  columns.value = columns.value === 4 ? 2 : 4
}

const actions: ExampleAction[] = [
  { label: 'Add 3', run: add },
  { label: 'Remove 3', run: remove },
  { label: 'Columns', run: toggleColumns },
]
</script>

<template>
  <ExampleWrapper :actions="actions">
    <AnimeTransitionGroup
      class="relative grid w-fit gap-2"
      :class="columns === 4 ? 'grid-cols-4' : 'grid-cols-2'"
      :animation="animation"
      :deps="[columns]"
    >
      <div
        v-for="tile in tiles"
        :key="tile"
        class="size-10 rounded-lg bg-primary"
      />
    </AnimeTransitionGroup>
  </ExampleWrapper>
</template>
