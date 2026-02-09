<script setup lang="ts">
import { spring } from '#nanime/easings'
import ExampleWrapper from '../../../shared/ExampleWrapper.vue'

const props = defineProps<{
  ease?: string
}>()

const box = useTemplateRef('box')

useAnimate(box, {
  x: [0, 300],
  duration: 1500,
  ease: props.ease || spring({ bounce: 0.4 }),
  loop: true,
  direction: 'alternate',
})
</script>

<template>
  <ExampleWrapper>
    <div class="relative flex items-center">
      <div
        ref="box"
        class="size-8 rounded-sm bg-primary shadow-sm"
      />
    </div>
  </ExampleWrapper>
</template>
