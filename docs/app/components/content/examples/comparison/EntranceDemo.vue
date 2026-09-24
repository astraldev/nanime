<script setup lang="ts">
import { stagger } from '#nanime/utils'
import ExampleWrapper, { type ExampleAction } from '~/components/shared/ExampleWrapper.vue'

const cards = useTemplateRef('cards')

const entrance = useAnimate(cards, {
  translateY: [16, 0],
  opacity: [0, 1],
  delay: stagger(80),
})

const actions: ExampleAction[] = [
  { label: 'Replay', run: () => entrance.restart() },
]
</script>

<template>
  <ExampleWrapper :actions="actions">
    <div class="grid grid-cols-4 gap-3">
      <div
        v-for="n in 4"
        :key="n"
        ref="cards"
        class="h-14 rounded-lg bg-primary"
      />
    </div>
  </ExampleWrapper>
</template>
