<script setup lang="ts">
import ExampleWrapper, { type ExampleAction } from '~/components/shared/ExampleWrapper.vue'

const styles = ['fade', 'slide-up', 'slide-down', 'slide-left', 'slide-right', 'scale', 'swap']

const style = ref('fade')
const runs = ref(0)

const actions = computed<ExampleAction[]>(() => styles.map(name => ({
  label: name,
  run: () => {
    style.value = name
    runs.value++
  },
  active: style.value === name,
})))
</script>

<template>
  <ExampleWrapper :actions="actions">
    <div class="grid size-16 place-items-center">
      <AnimeTransition
        mode="out-in"
        :animation="style"
      >
        <div
          :key="runs"
          class="size-12 rounded-lg bg-primary"
        />
      </AnimeTransition>
    </div>
  </ExampleWrapper>
</template>
