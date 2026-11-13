<script setup lang="ts">
import formal from 'nanime/presets/formal'
import elegant from 'nanime/presets/elegant'
import playful from 'nanime/presets/playful'
import BuiltinPresetsStage from './BuiltinPresetsStage.vue'
import ExampleWrapper, { type ExampleAction } from '~/components/shared/ExampleWrapper.vue'

const presets = { Formal: formal, Elegant: elegant, Playful: playful }

const presetName = ref<keyof typeof presets>('Formal')
const shown = ref(true)
const slideX = ref(0)
let timer: ReturnType<typeof setInterval> | undefined

provideAnimeDefaults(() => ({ preset: presets[presetName.value] }))

function tick() {
  shown.value = !shown.value
  slideX.value = slideX.value === 0 ? 120 : 0
}

function pick(name: keyof typeof presets) {
  presetName.value = name
  tick()
}

function pickFormal() {
  pick('Formal')
}

function pickElegant() {
  pick('Elegant')
}

function pickPlayful() {
  pick('Playful')
}

onMounted(() => {
  timer = setInterval(tick, 2400)
})

onBeforeUnmount(() => {
  clearInterval(timer)
})

const actions = computed<ExampleAction[]>(() => [
  { label: 'Formal', run: pickFormal, active: presetName.value === 'Formal' },
  { label: 'Elegant', run: pickElegant, active: presetName.value === 'Elegant' },
  { label: 'Playful', run: pickPlayful, active: presetName.value === 'Playful' },
])
</script>

<template>
  <ExampleWrapper
    :actions="actions"
    :status="presetName"
  >
    <BuiltinPresetsStage
      :key="presetName"
      :shown="shown"
      :slide-x="slideX"
    />
  </ExampleWrapper>
</template>
