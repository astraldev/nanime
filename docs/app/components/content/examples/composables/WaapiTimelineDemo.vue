<script setup lang="ts">
import { useWaapiTimeline } from '#nanime/experimental'
import ExampleWrapper, { type ExampleAction } from '~/components/shared/ExampleWrapper.vue'

const box = useTemplateRef('box')
const step = ref('idle')

const timeline = useWaapiTimeline({ defaults: { duration: 600 } })

timeline
  .tween(box, { translate: ['0px', '160px'] })
  .tween(box, { rotate: ['0deg', '180deg'], at: '< + 50%' })
  .point('turned', '< + 100%')
  .tween(box, { scale: ['1', '0.5'], at: 'turned' })
  .callback(() => (step.value = 'moving'), 0)
  .callback(() => (step.value = 'turned'), 'turned')

const actions: ExampleAction[] = [
  { label: 'Play', run: timeline.play },
]
</script>

<template>
  <ExampleWrapper
    :actions="actions"
    :status="step"
  >
    <div class="flex h-14 w-56 items-center">
      <div
        ref="box"
        class="size-10 rounded-lg bg-primary"
      />
    </div>
  </ExampleWrapper>
</template>
