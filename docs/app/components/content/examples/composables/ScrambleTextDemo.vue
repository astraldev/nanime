<script setup lang="ts">
import type { ScrambleTextParams } from '#nanime/types'
import { useIntervalFn } from '@vueuse/core'
import ExampleWrapper from '~/components/shared/ExampleWrapper.vue'

const el = useTemplateRef('text')

const index = ref(0)
const texts = [
  'Hello from nanime!',
  'Scramble text with Anime.js',
  'Reactive composables rock',
]

const scrambleConfig = computed((): ScrambleTextParams => ({
  text: texts[index.value],
  chars: 'braille',
  cursor: '▌',
  from: 'center',
  perturbation: 0.3,
  settleDuration: 400,
  revealRate: 40,
}))

useScrambleText(el, { duration: 2000 }, scrambleConfig)

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
