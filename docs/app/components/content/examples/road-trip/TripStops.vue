<script setup lang="ts">
import { spring } from '#nanime/easings'
import { stops, type TripStop } from '~/examples/road-trip/trip'

const props = defineProps<{
  progress: number
}>()

const emit = defineEmits<{
  select: [stop: TripStop]
}>()

const checkEnter = {
  opacity: [0, 1],
  scale: [0.6, 1],
  ease: spring({ bounce: 0.2, duration: 300 }),
}

const checkLeave = {
  opacity: 0,
  scale: 0.8,
  duration: 120,
  ease: 'out(2)',
}

const currentIndex = computed(() => stops.findLastIndex(stop => props.progress >= stop.at - 0.01))

function isReached(index: number) {
  return index <= currentIndex.value
}
</script>

<template>
  <ol
    data-live="2"
    class="grid grid-cols-2 gap-3 sm:grid-cols-4"
  >
    <li
      v-for="(stop, index) in stops"
      :key="stop.name"
    >
      <button
        type="button"
        class="flex h-full w-full cursor-pointer flex-col gap-1 rounded-xl border p-3 text-left transition-colors duration-300"
        :class="index === currentIndex ? 'border-primary bg-primary/10' : 'border-default hover:bg-elevated/60'"
        @click="emit('select', stop)"
      >
        <span class="flex items-center justify-between text-xs text-muted">
          {{ stop.day }}
          <span class="grid size-5 place-items-center">
            <AnimeTransition
              :enter-animation="checkEnter"
              :leave-animation="checkLeave"
            >
              <UIcon
                v-if="isReached(index)"
                name="i-ph-check-circle-fill"
                class="size-5 text-primary"
              />
            </AnimeTransition>
          </span>
        </span>
        <span class="font-semibold text-highlighted">{{ stop.name }}</span>
        <span class="text-sm text-muted">{{ stop.note }}</span>
      </button>
    </li>
  </ol>
</template>
