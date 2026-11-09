<script setup lang="ts">
import type { AnimationParams } from '#nanime/types'
import { random, shuffle } from '#nanime/utils'
import ExampleWrapper, { type ExampleAction } from '~/components/shared/ExampleWrapper.vue'

const enter: AnimationParams = {
  scale: [0, 1.25, 1],
  rotate: [-90, 15, 0],
  duration: 600,
  ease: 'out(3)',
}

const leave: AnimationParams = {
  y: [0, -12, 40],
  rotate: [0, 0, 45],
  opacity: [1, 1, 0],
  duration: 420,
  ease: 'in(2)',
}

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
      class="relative flex min-h-10 flex-wrap gap-2"
      :enter-animation="enter"
      :leave-animation="leave"
    >
      <li
        v-for="item in items"
        :key="item"
        class="flex size-10 items-center justify-center rounded-lg bg-primary font-semibold text-inverted"
      >
        {{ item }}
      </li>
    </AnimeTransitionGroup>
  </ExampleWrapper>
</template>
