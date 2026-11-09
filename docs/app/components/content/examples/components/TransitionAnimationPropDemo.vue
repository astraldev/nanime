<script setup lang="ts">
import type { AnimationParams, AnimeTransitionAnimation } from '#nanime/types'
import ExampleWrapper, { type ExampleAction } from '~/components/shared/ExampleWrapper.vue'

const animation = ref<string | AnimeTransitionAnimation>('slide-up')
const enterAnimation = ref<AnimationParams>()
const selected = ref('animation="slide-up"')
const runs = ref(0)

function select(label: string, next: string | AnimeTransitionAnimation, enter?: AnimationParams) {
  selected.value = label
  animation.value = next
  enterAnimation.value = enter
  runs.value++
}

function oneName() {
  select('animation="slide-up"', 'slide-up')
}

function enterLeaveApart() {
  select('animation={enter, leave}', { enter: 'slide-up', leave: 'fade' })
}

function propWins() {
  select('animation + enterAnimation', 'fade', { scale: [0.9, 1], duration: 400 })
}

function choiceAction(label: string, run: () => void): ExampleAction {
  return { label, run, active: selected.value === label }
}

const actions = computed<ExampleAction[]>(() => [
  choiceAction('animation="slide-up"', oneName),
  choiceAction('animation={enter, leave}', enterLeaveApart),
  choiceAction('animation + enterAnimation', propWins),
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
