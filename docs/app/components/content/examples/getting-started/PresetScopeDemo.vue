<script setup lang="ts">
import { random, shuffle } from '#nanime/utils'
import ExampleWrapper, { type ExampleAction } from '~/components/shared/ExampleWrapper.vue'

const components = {
  transition: { animation: 'sway' },
  transitionGroup: { animation: 'sway' },
  layoutGroup: {},
}

const presets = {
  Snappy: {
    shared: {
      sway: {
        enter: { opacity: [0, 1], scale: [0.6, 1], duration: 220, ease: 'outBack(3)' },
        leave: { opacity: 0, scale: 0.6, duration: 120, ease: 'in(3)' },
        move: { duration: 150, ease: 'out(3)' },
      },
    },
    components,
    composables: {},
  },
  Glide: {
    shared: {
      sway: {
        enter: { opacity: [0, 1], x: [-32, 0], duration: 700, ease: 'inOutSine' },
        leave: { opacity: 0, x: 32, duration: 500, ease: 'inOutSine' },
        move: { duration: 800, ease: 'inOutSine' },
      },
    },
    components,
    composables: {},
  },
}

const presetName = ref<keyof typeof presets>('Snappy')
const round = ref(0)
const items = ref([1, 2, 3, 4, 5])
let nextId = 6

provideAnimeDefaults(() => ({ preset: presets[presetName.value] }))

function snappy() {
  presetName.value = 'Snappy'
  round.value++
}

function glide() {
  presetName.value = 'Glide'
  round.value++
}

function add() {
  items.value.splice(random(0, items.value.length), 0, nextId++)
}

function remove() {
  items.value.splice(random(0, items.value.length - 1), 1)
}

function shuffleItems() {
  shuffle(items.value)
}

const actions = computed<ExampleAction[]>(() => [
  { label: 'Snappy', run: snappy, active: presetName.value === 'Snappy' },
  { label: 'Glide', run: glide, active: presetName.value === 'Glide' },
  { label: 'Add', run: add },
  { label: 'Remove', run: remove },
  { label: 'Shuffle', run: shuffleItems },
])
</script>

<template>
  <ExampleWrapper
    :actions="actions"
    :status="presetName"
  >
    <div class="flex flex-wrap items-center gap-6">
      <div class="flex size-12">
        <AnimeTransition mode="out-in">
          <div
            :key="`${presetName}-${round}`"
            class="size-12 rounded-lg bg-primary"
          />
        </AnimeTransition>
      </div>
      <AnimeTransitionGroup class="relative flex min-h-10 flex-wrap gap-2">
        <div
          v-for="item in items"
          :key="`${presetName}-${round}-${item}`"
          class="grid size-10 place-items-center rounded-lg bg-primary font-semibold text-black"
        >
          {{ item }}
        </div>
      </AnimeTransitionGroup>
    </div>
  </ExampleWrapper>
</template>
