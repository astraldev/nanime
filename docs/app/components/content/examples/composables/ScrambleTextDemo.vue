<script setup lang="ts">
import type { ScrambleTextParams } from '#nanime/types'
import ExampleWrapper from '~/components/shared/ExampleWrapper.vue'

const el = useTemplateRef('text')

const index = ref(0)
const texts = [
  'Hello from nanime!',
  'Scramble text with animejs!',
  'Reactive composables rock',
  'Care to star us on github? :)',
]

function next() {
  index.value = (index.value + 1) % texts.length
}

const animationConfig = {
  ease: 'inCirc',
  duration: 2500,
  delay: 2500,
  onComplete: next,
}

const scrambleConfig = computed((): ScrambleTextParams => ({
  text: texts[index.value],
  chars: 'symbols',
  perturbation: 0.3,
  settleRate: 25,
  settleDuration: 350,
  revealRate: 20,
}))

useScrambleText(el, animationConfig, scrambleConfig)
</script>

<template>
  <ExampleWrapper class="flex items-center justify-center">
    <p
      ref="text"
      class="font-mono text-lg"
    >
      Hello from nanime!
    </p>
  </ExampleWrapper>
</template>
