<script setup lang="ts">
import { createDrawable, createMotionPath } from '#nanime/proxies/svg'
import type { AnimationParams, DrawableSVGGeometry, ScrollObserver, ScrollObserverParams } from '#nanime/types'
import ExampleWrapper from '~/components/shared/ExampleWrapper.vue'
import CarTopDown from './CarTopDown.vue'

const SCENE_WIDTH = 2600
const SCENE_HEIGHT = 300
const ROAD = 'M 100 160 C 380 40 620 40 900 150 S 1340 262 1620 152 S 2040 48 2300 142 S 2470 186 2520 168'

const viewport = useTemplateRef<HTMLElement>('viewport')
const scene = useTemplateRef<HTMLElement>('scene')
const road = useTemplateRef<SVGPathElement>('road')
const trail = useTemplateRef<SVGPathElement>('trail')
const car = useTemplateRef<SVGGElement>('car')

const travelled = ref(0)
const isReversing = ref(false)
let previousTravelled = 0

function trackTravel(observer: ScrollObserver) {
  const next = observer.progress
  if (Math.abs(next - previousTravelled) > 0.0005) isReversing.value = next < previousTravelled
  previousTravelled = next
  travelled.value = next
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

const status = computed(() =>
  `${Math.round(travelled.value * 100)}% of the road · ${isReversing.value ? 'reversing' : 'driving'}`,
)
</script>

<template>
  <ExampleWrapper
    :status="status"
    :resizable="false"
  >
    <div class="w-full flex flex-col gap-2">
      <p class="text-xs text-muted">
        Scroll this panel sideways — drag its scrollbar, or hold Shift while scrolling.
      </p>

      <div
        ref="viewport"
        class="w-full overflow-x-auto overscroll-x-contain rounded-lg border border-primary/20 bg-primary/5"
      >
        <div
          ref="scene"
          class="w-max"
        >
          <svg
            :width="SCENE_WIDTH"
            :height="SCENE_HEIGHT"
            :viewBox="`0 0 ${SCENE_WIDTH} ${SCENE_HEIGHT}`"
            class="block text-primary"
          >
            <path
              :d="ROAD"
              class="stroke-current/20"
              fill="none"
              stroke-width="52"
              stroke-linecap="round"
            />

            <path
              ref="road"
              :d="ROAD"
              class="stroke-current/10"
              fill="none"
              stroke-width="44"
              stroke-linecap="round"
            />

            <path
              :d="ROAD"
              class="stroke-current/35"
              fill="none"
              stroke-width="2"
              stroke-dasharray="18 22"
              stroke-linecap="round"
            />

            <path
              ref="trail"
              :d="ROAD"
              class="stroke-current/60"
              fill="none"
              stroke-width="2.5"
              stroke-linecap="round"
            />

            <g
              ref="car"
              class="car"
            >
              <CarTopDown />
            </g>
          </svg>
        </div>
      </div>
    </div>
  </ExampleWrapper>
</template>

<style scoped>
.car {
  transform-box: fill-box;
  transform-origin: 50% 50%;
}
</style>
