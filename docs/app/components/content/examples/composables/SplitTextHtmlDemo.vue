<script setup lang="ts">
import { stagger, wrap } from '#nanime/utils'
import ExampleWrapper, { type ExampleAction } from '~/components/shared/ExampleWrapper.vue'

const sentences = [
  'Split every <strong>character</strong> of a sentence',
  'Water is H<sub>2</sub>O',
  'Energy is E = mc<sup>2</sup>',
  'Text can be <i>italic</i> and <mark>marked</mark>',
]

const heading = useTemplateRef('heading')
const index = ref(0)
const html = computed(() => sentences[index.value])

const { chars } = useSplitText(heading, { chars: true }, { html })

useAnimate(chars, () => ({
  scaleX: [0, 0.55, 0.9, 1],
  scaleY: [0, 1.4, 0.9, 1],
  y: [-12, 0],
  ease: 'outQuad',
  delay: stagger(20),
  duration: 420,
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
    <h2
      v-once
      ref="heading"
      class="font-mono text-xl text-default"
      v-html="html"
    />
  </ExampleWrapper>
</template>
