<script setup lang="ts">
import { stagger } from '#nanime/utils'
import ExampleWrapper from '../../../shared/ExampleWrapper.vue'

const text = useTemplateRef('phrase')
const { chars } = useSplitText(text, {
  chars: true,
})

useAnimate(chars, {
  y: [{ to: '-30%' }, { to: 0 }],
  delay: stagger(50),
  duration: 600,
  ease: 'inOutCirc',
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
