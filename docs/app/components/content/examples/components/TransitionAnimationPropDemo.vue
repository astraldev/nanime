<script setup lang="ts">
import type { AnimationParams, AnimeTransitionAnimation } from '#nanime/types'
import ExampleWrapper, { type ExampleAction } from '~/components/shared/ExampleWrapper.vue'

const animation = ref<string | AnimeTransitionAnimation>('slide-up')
const enterAnimation = ref<AnimationParams>()
const selected = ref('One name')
const runs = ref(0)

function select(label: string, next: string | AnimeTransitionAnimation, enter?: AnimationParams) {
  selected.value = label
  animation.value = next
  enterAnimation.value = enter
  runs.value++
}

function oneName() {
  select('One name', 'slide-up')
}

function enterLeaveApart() {
  select('Enter and leave apart', { enter: 'slide-up', leave: 'fade' })
}

function propWins() {
  select('A prop wins', 'fade', { scale: [0.9, 1], duration: 400 })
}

function choiceAction(label: string, run: () => void): ExampleAction {
  return { label, run, active: selected.value === label }
}

const actions = computed<ExampleAction[]>(() => [
  choiceAction('One name', oneName),
  choiceAction('Enter and leave apart', enterLeaveApart),
  choiceAction('A prop wins', propWins),
])
</script>

<template>
  <ExampleWrapper
    :actions="actions"
    :status="selected"
  >
    <div class="grid size-12 place-items-center">
      <AnimeTransition
        mode="out-in"
        :animation="animation"
        :enter-animation="enterAnimation"
      >
        <div
          :key="runs"
          class="size-12 rounded-lg bg-primary"
        />
      </AnimeTransition>
    </div>
  </ExampleWrapper>
</template>
