<script setup lang="ts">
import { useWaapiTimeline } from '#nanime/experimental'
import ExampleWrapper, { type ExampleAction } from '~/components/shared/ExampleWrapper.vue'

const box = useTemplateRef('box')
const last = ref('none')

const timeline = useWaapiTimeline()

timeline
  .point('move', 0)
  .point('mid move', 400)
  .point('moved', 800)
  .tween(box, { opacity: [0, 1], duration: 400, at: 'move' })
  .tween(box, { translate: ['0px', '160px'], duration: 800, at: 'move' })
  .callback(() => (last.value = 'move'), 'move')
  .callback(() => (last.value = 'mid move'), 'mid move')
  .callback(() => (last.value = 'moved'), 'moved')

const actions: ExampleAction[] = [
  { label: 'Play', run: timeline.play },
  { label: 'Reverse', run: timeline.reverse },
]
</script>

<template>
  <ExampleWrapper
    :actions="actions"
    :timer="timeline"
    :status="`last callback: ${last}`"
  >
    <div class="flex h-12 w-56 items-center">
      <div
        ref="box"
        class="size-10 rounded-lg bg-primary"
      />
    </div>
  </ExampleWrapper>
</template>
