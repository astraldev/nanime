<script setup lang="ts">
import { wrap } from '#nanime/utils'
import ExampleWrapper, { type ExampleAction } from '~/components/shared/ExampleWrapper.vue'

const sentences = [
  'Connection lost',
  'Reconnecting to the server',
  'Back online',
  'Welcome back, Ada',
]

const label = useTemplateRef('label')
const index = ref(0)

useScrambleText(label, {}, () => ({
  text: sentences[index.value],
  chars: 'braille',
  from: 'center',
  perturbation: 1,
  settleDuration: 35,
}))

const actions: ExampleAction[] = [
  { label: 'Previous', step: -1 },
  { label: 'Next', step: 1 },
].map(({ label, step }) => ({
  label,
  run: () => (index.value = wrap(index.value + step, 0, sentences.length)),
}))
</script>

<template>
  <ExampleWrapper :actions="actions">
    <p
      ref="label"
      class="font-mono text-lg"
    >
      {{ sentences[0] }}
    </p>
  </ExampleWrapper>
</template>
