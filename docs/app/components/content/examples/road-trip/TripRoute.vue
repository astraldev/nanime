<script setup lang="ts">
import { createDrawable, createMotionPath } from '#nanime/proxies/svg'
import type { AnimationParams, DrawableSVGGeometry, ScrollObserver, ScrollObserverParams } from '#nanime/types'
import { road as roadPath, sceneHeight, sceneWidth, stops } from '~/examples/road-trip/trip'
import CarTopDown from './CarTopDown.vue'

interface Point {
  x: number
  y: number
}

const emit = defineEmits<{
  progress: [value: number]
}>()

const viewport = useTemplateRef<HTMLElement>('viewport')
const scene = useTemplateRef<HTMLElement>('scene')
const road = useTemplateRef<SVGPathElement>('road')
const trail = useTemplateRef<SVGPathElement>('trail')
const car = useTemplateRef<SVGGElement>('car')

const travelled = ref(0)
const markers = shallowRef<Point[]>([])

function trackTravel(observer: ScrollObserver) {
  travelled.value = observer.progress
  emit('progress', observer.progress)
}

function scrubAcrossViewport(extra?: ScrollObserverParams) {
  return useAnimeScroll(() => ({
    container: viewport.value ?? undefined,
    target: scene.value ?? undefined,
    axis: 'x',
    enter: 'left left',
    leave: 'right right',
    sync: true,
    ...extra,
  }))
}

const carScroll = scrubAcrossViewport({ onUpdate: trackTravel })
const trailScroll = scrubAcrossViewport()

const drive = computed<AnimationParams>(() => {
  const path = road.value
  if (!path) return {}
  return {
    ...createMotionPath(path),
    ease: 'linear',
    autoplay: carScroll,
  }
})

const layTrail = computed<AnimationParams>(() => ({
  draw: ['0 0', '0 1'],
  ease: 'linear',
  autoplay: trailScroll,
}))

const trailDrawable = computed<DrawableSVGGeometry | null>(() => {
  const path = trail.value
  if (!path) return null
  return createDrawable(path)[0] ?? null
})

useAnimate(car, drive)
useAnimate([trailDrawable], layTrail)

function isReached(at: number) {
  return travelled.value >= at - 0.01
}

function scrollToStop(at: number) {
  const panel = viewport.value
  if (!panel) return
  panel.scrollTo({ left: at * (panel.scrollWidth - panel.clientWidth), behavior: 'smooth' })
}

function scrollToStart() {
  viewport.value?.scrollTo({ left: 0 })
}

onMounted(() => {
  const path = road.value
  if (!path) return
  const length = path.getTotalLength()
  markers.value = stops.map((stop) => {
    const { x, y } = path.getPointAtLength(length * stop.at)
    return { x, y }
  })
})

defineExpose({ scrollToStop, scrollToStart })
</script>

<template>
  <div class="relative">
    <div
      ref="viewport"
      data-live="1"
      class="w-full overflow-x-auto overscroll-x-contain rounded-xl border border-default bg-elevated/40"
    >
      <div
        ref="scene"
        class="w-max"
      >
        <svg
          :width="sceneWidth"
          :height="sceneHeight"
          :viewBox="`0 0 ${sceneWidth} ${sceneHeight}`"
          class="block text-primary"
        >
          <path
            :d="roadPath"
            class="stroke-current/20"
            fill="none"
            stroke-width="52"
            stroke-linecap="round"
          />
          <path
            ref="road"
            :d="roadPath"
            class="stroke-current/10"
            fill="none"
            stroke-width="44"
            stroke-linecap="round"
          />
          <path
            :d="roadPath"
            class="stroke-current/35"
            fill="none"
            stroke-width="2"
            stroke-dasharray="18 22"
            stroke-linecap="round"
          />
          <path
            ref="trail"
            :d="roadPath"
            class="stroke-current/60"
            fill="none"
            stroke-width="2.5"
            stroke-linecap="round"
          />

          <g
            v-for="(marker, index) in markers"
            :key="stops[index]?.name"
          >
            <circle
              :cx="marker.x"
              :cy="marker.y"
              r="11"
              class="stroke-current transition-colors duration-300"
              :class="isReached(stops[index]?.at ?? 1) ? 'fill-current' : 'fill-(--ui-bg)'"
              stroke-width="3"
            />
            <text
              :x="marker.x"
              :y="marker.y - 34"
              text-anchor="middle"
              class="fill-(--ui-text-highlighted) text-[15px] font-semibold"
            >
              {{ stops[index]?.name }}
            </text>
          </g>

          <g
            ref="car"
            class="car"
          >
            <CarTopDown />
          </g>
        </svg>
      </div>
    </div>
    <p class="pointer-events-none absolute bottom-3 left-4 flex items-center gap-1.5 rounded-md bg-default/80 px-2 py-1 text-xs text-muted backdrop-blur">
      <UIcon
        name="i-ph-arrows-left-right"
        class="size-3.5"
      />
      Scroll sideways, or Shift + scroll
    </p>
  </div>
</template>

<style scoped>
.car {
  transform-box: fill-box;
  transform-origin: 50% 50%;
}
</style>
