<script setup lang="ts">
import { scrambleText } from '#nanime/proxies/text'
import ExampleWrapper, { type ExampleAction } from '~/components/shared/ExampleWrapper.vue'

const title = useTemplateRef('title')

const timeline = useAnimeTimeline()

timeline
  .add(title, { innerHTML: scrambleText({ text: 'nanime', duration: 1200 }) })
  .add(title, { innerHTML: scrambleText({ text: 'nuxt', duration: 1200 }) })

function replay() {
  timeline.restart()
}

const actions: ExampleAction[] = [
  { label: 'Replay', run: replay },
]
</script>

<template>
  <ExampleWrapper :actions="actions">
    <p
      ref="title"
      class="font-mono text-lg"
    >
      nuxt
    </p>
  </ExampleWrapper>
</template>
