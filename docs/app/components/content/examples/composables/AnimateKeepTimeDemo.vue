<script setup lang="ts">
import ExampleWrapper, { type ExampleAction } from '~/components/shared/ExampleWrapper.vue'

const restartBox = useTemplateRef('restartBox')
const keepTimeBox = useTemplateRef('keepTimeBox')
const scale = ref(1)

function grow() {
  scale.value = 1.5
}

function shrink() {
  scale.value = 1
}

const params = () => ({
  x: 240,
  scale: scale.value,
  duration: 2000,
  ease: 'inOutQuad',
  alternate: true,
  loop: true,
})

useAnimate(restartBox, params)
useAnimate(keepTimeBox, params, { rebuild: 'keepTime' })

const actions = computed<ExampleAction[]>(() => [
  { label: 'Grow', run: grow, active: scale.value === 1.5 },
  { label: 'Shrink', run: shrink, active: scale.value === 1 },
])
</script>

<template>
  <ExampleWrapper :actions="actions">
    <div class="flex flex-col gap-3 font-mono text-xs">
      <div class="flex flex-col gap-1">
        <span>rebuild: 'restart'</span>
        <div
          ref="restartBox"
          class="size-10 rounded-lg bg-primary"
        />
      </div>
      <div class="flex flex-col gap-1">
        <span>rebuild: 'keepTime'</span>
        <div
          ref="keepTimeBox"
          class="size-10 rounded-lg bg-primary"
        />
      </div>
    </div>
  </ExampleWrapper>
</template>
