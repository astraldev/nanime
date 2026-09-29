<script setup lang="ts">
import { stagger } from '#nanime/utils'
import ExampleWrapper from '../../../shared/ExampleWrapper.vue'

const text = useTemplateRef('phrase')
const { chars } = useSplitText(text, {
  chars: true,
})

useWaapiAnimate(chars, {
  y: ['-30%', 0],
  delay: stagger(50),
  duration: 1000,
  ease: 'outBounce',
  alternate: true,
  loop: true,
})
</script>

<template>
  <ExampleWrapper>
    <span
      ref="phrase"
      class="text-xl text-default font-mono"
    >
      Hello World!
    </span>
  </ExampleWrapper>
</template>
