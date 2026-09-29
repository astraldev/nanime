<script setup lang="ts">
import { stagger } from '#nanime/utils'
import ExampleWrapper, { type ExampleAction } from '~/components/shared/ExampleWrapper.vue'

const eases = ['outBack(3)', 'inOutExpo', 'outElastic(1, .5)', 'steps(6)']

const boxes = useTemplateRef('boxes')
const ease = ref<string>(eases[0])

useWaapiAnimate(boxes, () => ({
  transform: ['translateY(-24px)', 'translateY(0px)'],
  ease: ease.value,
  duration: 1000,
  delay: stagger(80),
  alternate: true,
  loop: true,
}))

const actions = computed<ExampleAction[]>(() => eases.map(name => ({
  label: name,
  run: () => (ease.value = name),
  active: ease.value === name,
})))
</script>

<template>
  <ExampleWrapper :actions="actions">
    <div class="flex gap-2.5 pt-6">
      <div
        v-for="i in 6"
        ref="boxes"
        :key="i"
        class="size-8 rounded-lg bg-primary"
      />
    </div>
  </ExampleWrapper>
</template>
