<script setup lang="ts">
import { useWaapiTimeline } from '#nanime/experimental'
import ExampleWrapper, { type ExampleAction, type ExampleSlider } from '~/components/shared/ExampleWrapper.vue'

const box = useTemplateRef('box')
const progress = ref(0)
const state = ref('idle')
let frame = 0

const timeline = useWaapiTimeline({
  defaults: { duration: 600, ease: 'outQuad' },
})

timeline
  .tween(box, { translate: ['0px', '160px'] })
  .tween(box, { rotate: ['0deg', '180deg'], at: '<+50%' })
  .tween(box, { scale: ['1', '0.5'], at: '<+100%', duration: 400 })
  .tween(box, { translate: ['160px', '0px'], at: '<' })

function readState() {
  progress.value = timeline.progress
  if (timeline.isRunning.value) state.value = 'running'
  else if (timeline.paused) state.value = 'paused'
  else if (timeline.completed) state.value = 'completed'
  else state.value = 'idle'

  cancelAnimationFrame(frame)
  if (timeline.isRunning.value) frame = requestAnimationFrame(readState)
}

watch(timeline.isRunning, readState)
onScopeDispose(() => cancelAnimationFrame(frame))

function seek(value: number) {
  timeline.seek(value * timeline.duration)
  readState()
}

const actions = computed<ExampleAction[]>(() => [
  { label: 'Play', run: timeline.play },
  { label: 'Pause', run: timeline.pause },
  { label: 'Resume', run: timeline.resume },
  { label: 'Reverse', run: timeline.reverse },
  { label: 'Restart', run: timeline.restart },
  { label: 'Alternate', run: timeline.alternate },
])

const slider = computed<ExampleSlider>(() => ({ value: progress.value, onInput: seek }))
</script>

<template>
  <ExampleWrapper
    :actions="actions"
    :slider="slider"
    :status="state"
  >
    <div class="flex h-20 w-56 items-center">
      <div
        ref="box"
        class="size-10 rounded-lg bg-primary"
      />
    </div>
  </ExampleWrapper>
</template>
