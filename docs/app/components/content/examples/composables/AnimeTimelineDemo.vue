<script setup lang="ts">
import { scrambleText } from '#nanime/proxies/text'
import ExampleWrapper from '~/components/shared/ExampleWrapper.vue'

const box = useTemplateRef('box')
const label = useTemplateRef('label')

const tl = useAnimeTimeline({ loop: true })

tl
  .add(box, { translateX: 250, duration: 800 })
  .add(label, { innerHTML: scrambleText({ text: 'moved!' }) }, '<<')
  .add({ duration: 500 })
  .add(box, { rotate: 360, duration: 600 })
  .add(label, { innerHTML: scrambleText({ text: 'spinning!' }) }, '<<')
  .add({ duration: 500 })
  .add(box, { translateX: 0, rotate: 0, duration: 800 })
  .add(label, { innerHTML: scrambleText({ text: 'ready' }) }, '<<')
  .add({ duration: 1000 })
</script>

<template>
  <ExampleWrapper>
    <div
      ref="box"
      class="simple-box !size-8"
    />
    <p
      ref="label"
      class="font-mono text-sm text-(--color-primary)"
    >
      ready
    </p>
  </ExampleWrapper>
</template>
