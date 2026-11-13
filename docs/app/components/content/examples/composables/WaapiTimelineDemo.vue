<script setup lang="ts">
import { useWaapiTimeline } from '#nanime/experimental'
import ExampleWrapper, { type ExampleAction } from '~/components/shared/ExampleWrapper.vue'

const panel = useTemplateRef('panel')

const timeline = useWaapiTimeline({
  defaults: { duration: 500, ease: 'ease-out' },
  autoplay: true,
})

timeline
  .point('open', 0)
  .tween(panel, {
    opacity: [0, 1],
    transform: ['translateX(-40px)', 'translateX(0)'],
    at: 'open',
  })
  .tween(panel, {
    opacity: [1, 0.55],
    transform: ['translateX(0)', 'translateX(72px)'],
    duration: 400,
    at: '<+100%',
    delay: 150,
  })

const actions = computed<ExampleAction[]>(() => [
  { label: 'Play', run: () => timeline.play(), active: timeline.isRunning.value },
  { label: 'Reverse', run: () => timeline.reverse() },
  { label: 'Seek 50%', run: () => timeline.seek(timeline.duration / 2) },
])
</script>

<template>
  <ExampleWrapper :actions="actions">
    <div class="flex h-28 items-center">
      <div
        ref="panel"
        class="size-16 rounded-xl bg-primary"
      />
    </div>
  </ExampleWrapper>
</template>
