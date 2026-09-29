<script setup lang="ts">
import { random } from '#nanime/utils'

const props = defineProps<{
  playing: boolean
  volume: number
}>()

const barCount = 16
const restLevel = 0.08
const bars = Array.from({ length: barCount }, (_, index) => `bar${index}`)

const levels = reactive<Record<string, number>>(Object.fromEntries(bars.map(bar => [bar, restLevel])))
const levelParams = Object.fromEntries(bars.map(bar => [bar, { duration: 180, ease: 'out(2)' }]))
const levelsTo = useAnimatable(levels, levelParams)

let timer: ReturnType<typeof setInterval> | undefined

function pulse() {
  const loudness = 0.25 + 0.75 * props.volume
  for (const bar of bars) levelsTo[bar]?.(random(0.15, 1, 2) * loudness)
}

function rest() {
  for (const bar of bars) levelsTo[bar]?.(restLevel)
}

function sync() {
  clearInterval(timer)
  if (!props.playing) return rest()
  pulse()
  timer = setInterval(pulse, 180)
}

watch(() => props.playing, sync)
onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <div
    class="flex h-10 items-end gap-1"
    aria-hidden="true"
  >
    <span
      v-for="bar in bars"
      :key="bar"
      class="h-full w-1.5 origin-bottom rounded-full bg-primary/70"
      :style="{ transform: `scaleY(${levels[bar]})` }"
    />
  </div>
</template>
