<script setup lang="ts">
import ExampleWrapper from '~/components/shared/ExampleWrapper.vue'

const texts = [
  'Hello from nanime!',
  'Scramble text with animejs!',
  'Reactive composables rock',
  'Care to star us on github? :)',
]

const label = useTemplateRef('label')
const index = ref(0)

function next() {
  index.value = (index.value + 1) % texts.length
}

useScrambleText(label, { onComplete: next }, () => ({
  text: texts[index.value],
  chars: 'symbols',
  duration: 5000,
  delay: 2500,
}))
</script>

<template>
  <ExampleWrapper class="flex items-center justify-center">
    <p
      ref="label"
      class="font-mono text-lg"
    >
      Hello from nanime!
    </p>
  </ExampleWrapper>
</template>
