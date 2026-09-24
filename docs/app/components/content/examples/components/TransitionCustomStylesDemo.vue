<script setup lang="ts">
import ExampleWrapper, { type ExampleAction } from '~/components/shared/ExampleWrapper.vue'

const style = ref('pop')
const runs = ref(0)

function play(name: string) {
  style.value = name
  runs.value++
}

function styleAction(name: string): ExampleAction {
  return { label: name, run: () => play(name), active: style.value === name }
}

const actions = computed<ExampleAction[]>(() => [
  styleAction('pop'),
  styleAction('skew'),
  styleAction('shake'),
  styleAction('glow'),
  styleAction('explode'),
  styleAction('flip'),
])
</script>

<template>
  <ExampleWrapper :actions="actions">
    <div class="size-12">
      <AnimeTransition
        mode="out-in"
        :enter-animation="style"
        :leave-animation="style"
      >
        <div
          :key="runs"
          class="size-12 rounded-lg bg-primary"
        />
      </AnimeTransition>
    </div>
  </ExampleWrapper>
</template>
