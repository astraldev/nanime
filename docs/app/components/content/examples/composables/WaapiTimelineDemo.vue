<script setup lang="ts">
import { useWaapiTimeline } from '#nanime/experimental'
import ExampleWrapper, { type ExampleAction } from '~/components/shared/ExampleWrapper.vue'

const first = useTemplateRef('first')
const second = useTemplateRef('second')
const third = useTemplateRef('third')
const fourth = useTemplateRef('fourth')
const fifth = useTemplateRef('fifth')
const crossings = ref(0)

const timeline = useWaapiTimeline({
  defaults: { duration: 600, ease: 'inOutQuad' },
  autoplay: true,
})

timeline
  .tween(first, { translate: ['0px', '192px'], at: 0 })
  .tween(second, { translate: ['0px', '192px'], at: '<+50%' })
  .point('settle', '<+100%')
  .tween(third, { translate: ['0px', '192px'], at: 'settle' })
  .tween(fourth, { translate: ['0px', '192px'], at: '<' })
  .tween(fifth, { translate: ['0px', '192px'], at: 'settle+300' })
  .callback(() => crossings.value++, 'settle')

const actions = computed<ExampleAction[]>(() => [
  { label: 'Play', run: timeline.play, active: timeline.isRunning.value },
  { label: 'Reverse', run: timeline.reverse },
])
</script>

<template>
  <ExampleWrapper
    :actions="actions"
    :status="`settle crossed ${crossings}×`"
  >
    <div class="grid w-fit grid-cols-[auto_14rem] items-center gap-x-4 gap-y-2 font-mono text-xs text-primary">
      <span>at: 0</span>
      <div
        ref="first"
        class="size-6 rounded-lg bg-primary"
      />
      <span>at: '&lt;+50%'</span>
      <div
        ref="second"
        class="size-6 rounded-lg bg-primary"
      />
      <span>at: 'settle'</span>
      <div
        ref="third"
        class="size-6 rounded-lg bg-primary"
      />
      <span>at: '&lt;'</span>
      <div
        ref="fourth"
        class="size-6 rounded-lg bg-primary"
      />
      <span>at: 'settle+300'</span>
      <div
        ref="fifth"
        class="size-6 rounded-lg bg-primary"
      />
    </div>
  </ExampleWrapper>
</template>
