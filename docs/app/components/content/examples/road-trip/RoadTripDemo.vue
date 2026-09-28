<script setup lang="ts">
import type { TripStop } from '~/examples/road-trip/trip'
import SceneWindow from '../shared/SceneWindow.vue'
import TripBooking from './TripBooking.vue'
import TripHeader from './TripHeader.vue'
import TripRoute from './TripRoute.vue'
import TripStops from './TripStops.vue'

const progress = ref(0)
const replay = ref(0)
const route = useTemplateRef('route')
const booking = useTemplateRef('booking')

function setProgress(value: number) {
  progress.value = value
}

function goToStop(stop: TripStop) {
  route.value?.scrollToStop(stop.at)
}

function reset() {
  route.value?.scrollToStart()
  booking.value?.reset()
  replay.value++
}
</script>

<template>
  <SceneWindow
    title="Trips"
    @reset="reset"
  >
    <TripHeader :key="replay" />

    <div class="grid gap-5 p-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <div class="flex min-w-0 flex-col gap-4">
        <TripRoute
          ref="route"
          @progress="setProgress"
        />
        <TripStops
          :progress="progress"
          @select="goToStop"
        />
      </div>

      <TripBooking ref="booking" />
    </div>
  </SceneWindow>
</template>
