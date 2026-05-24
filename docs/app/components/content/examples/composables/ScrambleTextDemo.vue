<script setup lang="ts">
import type { ScrambleTextParams } from '#nanime/types'
import { useIntervalFn } from '@vueuse/core'
import ExampleWrapper from '~/components/shared/ExampleWrapper.vue'

const el = useTemplateRef('text')

const index = ref(0)
const texts = [
  'Hello from nanime!',
  'Scramble text with animejs!',
  'Reactive composables rock',
  'Care to star us on github? :)',
]

const scrambleConfig = computed((): ScrambleTextParams => ({
  text: texts[index.value],
  chars: 'symbols',
  perturbation: 0.3,
  settleRate: 25,
  settleDuration: 350,
  revealRate: 20,
}))

useScrambleText(el, { ease: 'inCirc', duration: 2500 }, scrambleConfig)

useIntervalFn(() => {
  index.value = (index.value + 1) % texts.length
}, 5000)
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
