<script setup lang="ts">
import ExampleWrapper, { type ExampleAction } from '~/components/shared/ExampleWrapper.vue'

const scales = [1, 1.5]

const restarting = useTemplateRef('restarting')
const keeping = useTemplateRef('keeping')
const scale = ref(1)

const params = () => ({
  x: 200,
  scale: scale.value,
  duration: 4000,
  ease: 'linear',
  alternate: true,
  loop: true,
})

useAnimate(restarting, params)
useAnimate(keeping, params, { keepTime: true })

const actions = computed<ExampleAction[]>(() => scales.map(value => ({
  label: `scale ${value}`,
  run: () => (scale.value = value),
  active: scale.value === value,
})))
</script>

<template>
  <ExampleWrapper :actions="actions">
    <div class="flex flex-col gap-3 font-mono text-xs">
      <div class="flex flex-col gap-1">
        <span>keepTime: false</span>
        <div
          ref="restarting"
          class="size-10 rounded-lg bg-primary"
        />
      </div>
      <div class="flex flex-col gap-1">
        <span>keepTime: true</span>
        <div
          ref="keeping"
          class="size-10 rounded-lg bg-primary"
        />
      </div>
    </div>
  </ExampleWrapper>
</template>
