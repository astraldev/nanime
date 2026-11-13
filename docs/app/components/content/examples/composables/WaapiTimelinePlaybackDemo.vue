<script setup lang="ts">
import { useWaapiTimeline } from '#nanime/experimental'
import ExampleWrapper, { type ExampleAction } from '~/components/shared/ExampleWrapper.vue'

const box = useTemplateRef('box')
const state = ref('idle')

const timeline = useWaapiTimeline({
  defaults: { duration: 1000, ease: 'inOutQuad' },
})

timeline
  .tween(box, { translate: ['0px', '64px'] })
  .tween(box, { translate: ['64px', '128px'], at: '< + 100%' })
  .tween(box, { translate: ['128px', '192px'], at: '< + 100%' })

function readState() {
  if (timeline.isRunning.value) state.value = 'running'
  else if (timeline.paused) state.value = 'paused'
  else if (timeline.completed) state.value = 'completed'
}

watch(timeline.isRunning, readState)

const actions: ExampleAction[] = [
  { label: 'Play', run: timeline.play },
  { label: 'Pause', run: timeline.pause },
  { label: 'Resume', run: timeline.resume },
  { label: 'Reverse', run: timeline.reverse },
  { label: 'Restart', run: timeline.restart },
  { label: 'Alternate', run: timeline.alternate },
]
</script>

<template>
  <ExampleWrapper
    :actions="actions"
    :status="state"
  >
    <div class="flex w-54 flex-col gap-2">
      <div
        ref="box"
        class="size-6 rounded-lg bg-primary"
      />
      <div class="flex justify-between font-mono text-xs text-primary">
        <span class="w-6 text-center">0</span>
        <span class="w-6 text-center">1s</span>
        <span class="w-6 text-center">2s</span>
        <span class="w-6 text-center">3s</span>
      </div>
    </div>
  </ExampleWrapper>
</template>
