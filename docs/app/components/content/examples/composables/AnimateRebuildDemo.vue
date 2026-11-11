<script setup lang="ts">
import ExampleWrapper, { type ExampleAction } from '~/components/shared/ExampleWrapper.vue'

const restarting = useTemplateRef('restarting')
const keepingTime = useTemplateRef('keepingTime')
const keepingValue = useTemplateRef('keepingValue')
const x = ref(100)

const params = () => ({
  x: x.value,
  duration: 2000,
  ease: 'inOutQuad',
  alternate: true,
  loop: true,
})

useAnimate(restarting, params)
useAnimate(keepingTime, params, { rebuild: 'keepTime' })
useAnimate(keepingValue, params, { rebuild: 'keepValue' })

const actions = computed<ExampleAction[]>(() => [
  { label: '100px', run: () => (x.value = 100), active: x.value === 100 },
  { label: '200px', run: () => (x.value = 200), active: x.value === 200 },
])
</script>

<template>
  <ExampleWrapper :actions="actions">
    <div class="flex flex-col gap-3 font-mono text-xs">
      <div class="flex flex-col gap-1">
        <span>rebuild: 'restart'</span>
        <div
          ref="restarting"
          class="size-10 rounded-lg bg-primary"
        />
      </div>
      <div class="flex flex-col gap-1">
        <span>rebuild: 'keepTime'</span>
        <div
          ref="keepingTime"
          class="size-10 rounded-lg bg-primary"
        />
      </div>
      <div class="flex flex-col gap-1">
        <span>rebuild: 'keepValue'</span>
        <div
          ref="keepingValue"
          class="size-10 rounded-lg bg-primary"
        />
      </div>
    </div>
  </ExampleWrapper>
</template>
