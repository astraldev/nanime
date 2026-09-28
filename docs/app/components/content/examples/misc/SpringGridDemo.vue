<script setup lang="ts">
import { random, shuffle as shuffled } from '#nanime/utils'
import SceneWindow from '../shared/SceneWindow.vue'

interface Card {
  id: number
  accent: boolean
  lines: number
}

const MIN_CARDS = 3
const MAX_CARDS = 12
const IDLE_AFTER_INTERACTION = 4000

function createCard(id: number): Card {
  return { id, accent: id % 4 === 0, lines: 2 + (id % 3) }
}

const startingCards = () => Array.from({ length: 10 }, (_, index) => createCard(index + 1))

const cards = ref<Card[]>(startingCards())
const expandedId = ref<number | null>(null)
let nextId = 11

const canAdd = computed(() => cards.value.length < MAX_CARDS)
const canRemove = computed(() => cards.value.length > MIN_CARDS)

const middle = () => Math.floor(cards.value.length / 2)

function cardClass(card: Card) {
  return card.id === expandedId.value ? 'col-span-2 row-span-2' : ''
}

function addAt(index: number) {
  if (canAdd.value) cards.value.splice(index, 0, createCard(nextId++))
}

function removeCard(card: Card | undefined) {
  if (!card || !canRemove.value) return
  cards.value = cards.value.filter(item => item !== card)
  if (card.id === expandedId.value) expandedId.value = null
}

function expand(card: Card | undefined) {
  if (card) expandedId.value = card.id
}

function collapse() {
  expandedId.value = null
}

function shift() {
  const first = cards.value.shift()
  if (first) cards.value.push(first)
}

const steps = [
  () => addAt(middle()),
  () => expand(cards.value[middle()]),
  shift,
  collapse,
  () => removeCard(cards.value[middle()]),
]

const hovered = ref(false)
let resumeAt = 0
let stepIndex = -1
let timer: ReturnType<typeof setInterval> | undefined

function playNextStep() {
  if (hovered.value || Date.now() < resumeAt) return
  stepIndex = (stepIndex + 1) % steps.length
  steps[stepIndex]?.()
}

function interact(action: () => void) {
  resumeAt = Date.now() + IDLE_AFTER_INTERACTION
  action()
}

function add() {
  interact(() => addAt(random(0, cards.value.length)))
}

function remove() {
  interact(() => removeCard(cards.value[random(0, cards.value.length - 1)]))
}

function shuffle() {
  interact(() => (cards.value = shuffled([...cards.value])))
}

function toggle(card: Card) {
  interact(() => (card.id === expandedId.value ? collapse() : expand(card)))
}

function reset() {
  cards.value = startingCards()
  expandedId.value = null
  nextId = 11
  stepIndex = -1
  resumeAt = 0
}

onMounted(() => (timer = setInterval(playNextStep, 1800)))
onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <SceneWindow
    title="Dashboard"
    class="mx-auto w-full max-w-5xl"
    @reset="reset"
  >
    <div
      class="flex h-[32rem] gap-4 bg-muted/40 p-4 sm:aspect-video sm:h-auto"
      @pointerenter="hovered = true"
      @pointerleave="hovered = false"
    >
      <div class="hidden w-36 shrink-0 flex-col gap-3 sm:flex">
        <div class="h-2.5 w-20 rounded-full bg-primary/50" />
        <div class="h-2.5 w-28 rounded-full bg-accented" />
        <div class="h-2.5 w-24 rounded-full bg-accented" />
        <div class="h-2.5 w-28 rounded-full bg-accented" />
        <div class="mt-4 h-2.5 w-16 rounded-full bg-accented/70" />
        <div class="h-2.5 w-24 rounded-full bg-accented/70" />
        <div class="h-2.5 w-20 rounded-full bg-accented/70" />
      </div>

      <div class="flex min-w-0 flex-1 flex-col gap-3">
        <div class="flex items-center gap-1.5">
          <div class="h-2.5 w-24 rounded-full bg-accented sm:w-32" />
          <button
            type="button"
            data-live="3"
            aria-label="Remove a card"
            class="ml-auto grid size-7 cursor-pointer place-items-center rounded-md bg-elevated text-muted hover:text-highlighted disabled:cursor-not-allowed disabled:opacity-40"
            :disabled="!canRemove"
            @click="remove"
          >
            <UIcon
              name="i-ph-minus-bold"
              class="size-3.5"
            />
          </button>
          <button
            type="button"
            data-live="2"
            aria-label="Shuffle cards"
            class="grid size-7 cursor-pointer place-items-center rounded-md bg-elevated text-muted hover:text-highlighted"
            @click="shuffle"
          >
            <UIcon
              name="i-ph-shuffle-bold"
              class="size-3.5"
            />
          </button>
          <button
            type="button"
            data-live="1"
            class="flex h-7 cursor-pointer items-center gap-1 rounded-md bg-primary px-2.5 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
            :disabled="!canAdd"
            @click="add"
          >
            <UIcon
              name="i-ph-plus-bold"
              class="size-3.5"
            />
            Add
          </button>
        </div>

        <AnimeTransitionGroup
          data-live="4"
          class="relative grid min-h-0 flex-1 grid-flow-dense grid-cols-2 grid-rows-8 gap-2 sm:grid-cols-5 sm:grid-rows-3 sm:gap-3"
        >
          <button
            v-for="card in cards"
            :key="card.id"
            type="button"
            :aria-label="card.id === expandedId ? 'Collapse card' : 'Expand card'"
            class="group flex cursor-pointer flex-col gap-1.5 rounded-lg border border-default bg-elevated p-2.5 text-left transition-[background-color,border-color,box-shadow] duration-200 hover:border-primary hover:bg-primary/10 hover:shadow-lg hover:shadow-primary/10"
            :class="cardClass(card)"
            @click="toggle(card)"
          >
            <span
              class="block h-2 w-1/2 rounded-full transition-colors duration-200 group-hover:bg-primary"
              :class="card.accent ? 'bg-primary/60' : 'bg-accented'"
            />
            <span
              v-for="line in card.lines"
              :key="line"
              class="block h-1.5 rounded-full bg-accented/70 transition-colors duration-200 group-hover:bg-primary/40"
              :class="line === card.lines ? 'w-2/3' : 'w-full'"
            />
          </button>
        </AnimeTransitionGroup>
      </div>
    </div>
  </SceneWindow>
</template>
