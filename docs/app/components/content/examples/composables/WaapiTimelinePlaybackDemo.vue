<script setup lang="ts">
import { useWaapiTimeline } from '#nanime/experimental'
import ExampleWrapper, { type ExampleAction } from '~/components/shared/ExampleWrapper.vue'

const box = useTemplateRef('box')
const state = ref('idle')
const position = ref(0)
let frame = 0

const timeline = useWaapiTimeline({
  defaults: { duration: 1000, ease: 'inOutQuad' },
})

timeline
  .tween(box, { translate: ['0px', '64px'] })
  .tween(box, { translate: ['64px', '128px'] })
  .tween(box, { translate: ['128px', '192px'] })

function readState() {
  if (timeline.isRunning.value) state.value = 'running'
  else if (timeline.paused) state.value = 'paused'
  else if (timeline.completed) state.value = 'completed'
}

function followPlayhead() {
  position.value = timeline.progress
  frame = timeline.isRunning.value ? requestAnimationFrame(followPlayhead) : 0
}

function scrub(value: number) {
  position.value = value
  timeline.seek(value * timeline.duration)
}

watch(timeline.isRunning, () => {
  readState()
  cancelAnimationFrame(frame)
  followPlayhead()
})

onBeforeUnmount(() => cancelAnimationFrame(frame))

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
    :slider="{ value: position, onInput: scrub }"
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
