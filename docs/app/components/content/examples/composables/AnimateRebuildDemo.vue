<script setup lang="ts">
import ExampleWrapper, { type ExampleAction } from '~/components/shared/ExampleWrapper.vue'

const keepValueBox = useTemplateRef('keepValueBox')
const blendBox = useTemplateRef('blendBox')
const turns = ref(0)
const slideRun = ref(0)

function slide() {
  turns.value = 0
  slideRun.value++
}

function spin() {
  turns.value++
}

const slideParams = () => ({ x: [0, 240], duration: 4000, ease: 'linear' })
const spinParams = () => ({ rotate: turns.value * 360, duration: 1000 })
const slideOrSpin = () => (turns.value ? spinParams() : slideParams())

useAnimate(keepValueBox, slideOrSpin, { rebuild: 'keepValue' })
useAnimate(blendBox, () => ({ ...slideOrSpin(), composition: 'blend' }), { rebuild: 'keepValue' })

const actions: ExampleAction[] = [
  { label: 'Slide', run: slide },
  { label: 'Spin', run: spin },
]
</script>

<template>
  <ExampleWrapper :actions="actions">
    <div
      :key="slideRun"
      class="flex flex-col gap-3 font-mono text-xs"
    >
      <div class="flex flex-col gap-1">
        <span>rebuild: 'keepValue'</span>
        <div
          ref="keepValueBox"
          class="size-10 rounded-lg bg-primary"
        />
      </div>
      <div class="flex flex-col gap-1">
        <span>rebuild: 'keepValue' + composition: 'blend'</span>
        <div
          ref="blendBox"
          class="size-10 rounded-lg bg-primary"
        />
      </div>
    </div>
  </ExampleWrapper>
</template>
