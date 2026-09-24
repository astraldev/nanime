<script setup lang="ts">
import { spring } from '#nanime/easings'
import { stagger } from '#nanime/utils'

interface Card {
  id: number
  accent: boolean
  lines: number
}

const enterAnimation = {
  opacity: [0, 1],
  scale: [0.6, 1],
  ease: spring({ bounce: 0.45, duration: 600 }),
}

const leaveAnimation = {
  opacity: 0,
  scale: 0.6,
  duration: 250,
  ease: 'in(3)',
}

const moveAnimation = {
  delay: stagger(20, { from: 'center' }),
  ease: spring({ bounce: 0.3, duration: 550 }),
}

function createCard(id: number): Card {
  return { id, accent: id % 4 === 0, lines: 2 + (id % 3) }
}

const cards = ref<Card[]>(Array.from({ length: 10 }, (_, index) => createCard(index + 1)))
const expandedId = ref<number | null>(null)
let nextId = 11

const middle = () => Math.floor(cards.value.length / 2)

function cardClass(card: Card) {
  return card.id === expandedId.value ? 'col-span-2 row-span-2' : ''
}

function addToCenter() {
  cards.value.splice(middle(), 0, createCard(nextId++))
}

function expandCenter() {
  expandedId.value = cards.value[middle()]?.id ?? null
}

function shift() {
  const first = cards.value.shift()
  if (first) cards.value.push(first)
}

function collapse() {
  expandedId.value = null
}

function removeFromCenter() {
  cards.value.splice(middle(), 1)
}

const steps = [addToCenter, expandCenter, shift, collapse, removeFromCenter]

let stepIndex = -1
let timer: ReturnType<typeof setInterval> | undefined

function playNextStep() {
  stepIndex = (stepIndex + 1) % steps.length
  steps[stepIndex]?.()
}

onMounted(() => (timer = setInterval(playNextStep, 1800)))
onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <div class="mx-auto flex h-[32rem] w-full max-w-5xl flex-col overflow-hidden rounded-xl border border-default bg-muted/40 sm:aspect-video sm:h-auto">
    <div class="flex items-center gap-2 border-b border-default px-4 py-2.5">
      <div class="size-2.5 rounded-full bg-accented" />
      <div class="size-2.5 rounded-full bg-accented" />
      <div class="size-2.5 rounded-full bg-accented" />
      <div class="ml-4 h-2.5 w-40 rounded-full bg-accented" />
      <div class="ml-auto h-2.5 w-16 rounded-full bg-primary/40" />
    </div>

    <div class="flex min-h-0 flex-1 gap-4 p-4">
      <div class="hidden w-36 shrink-0 flex-col gap-3 sm:flex">
        <div class="h-2.5 w-20 rounded-full bg-primary/50" />
        <div class="h-2.5 w-28 rounded-full bg-accented" />
        <div class="h-2.5 w-24 rounded-full bg-accented" />
        <div class="h-2.5 w-28 rounded-full bg-accented" />
        <div class="mt-4 h-2.5 w-16 rounded-full bg-accented/70" />
        <div class="h-2.5 w-24 rounded-full bg-accented/70" />
        <div class="h-2.5 w-20 rounded-full bg-accented/70" />
      </div>

      <AnimeTransitionGroup
        class="relative grid flex-1 grid-flow-dense grid-cols-2 grid-rows-7 gap-2 sm:grid-cols-5 sm:grid-rows-3 sm:gap-3"
        :enter-animation="enterAnimation"
        :leave-animation="leaveAnimation"
        :move-animation="moveAnimation"
      >
        <div
          v-for="card in cards"
          :key="card.id"
          class="flex flex-col gap-1.5 rounded-lg border border-default bg-elevated p-2.5"
          :class="cardClass(card)"
        >
          <div
            class="h-2 w-1/2 rounded-full"
            :class="card.accent ? 'bg-primary/60' : 'bg-accented'"
          />
          <div
            v-for="line in card.lines"
            :key="line"
            class="h-1.5 rounded-full bg-accented/70"
            :class="line === card.lines ? 'w-2/3' : 'w-full'"
          />
        </div>
      </AnimeTransitionGroup>
    </div>
  </div>
</template>
