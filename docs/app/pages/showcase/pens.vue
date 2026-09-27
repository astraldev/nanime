<script setup lang="ts">
import type { Timer } from '#nanime/types'
import { sync } from '#nanime/utils'
import { useSceneColors } from '~/showcase/pens/colors'
import { createPenScene, type PenScene, type SceneState, type Writing } from '~/showcase/pens/scene'
import { useScrub } from '~/showcase/pens/scroll'

definePageMeta({ layout: false, header: false, footer: false })

useHead({ title: 'Pens' })

const TAU = Math.PI * 2
// One screen of scroll on the flight timeline.
const SECTION = 1000

const canvas = useTemplateRef<HTMLCanvasElement>('canvas')
const approach = useTemplateRef<HTMLElement>('approach')
const scrollCta = useTemplateRef<HTMLElement>('scrollCta')
const scrollCtaText = useTemplateRef<HTMLElement>('scrollCtaText')

const state: SceneState = {
  position: { x: 80, y: -32, z: -60 },
  rotation: { x: 0, y: TAU * -0.25, z: 0 },
  writing: { x: 0, y: 0, weight: 0, lift: 0, resting: 0 },
}

let scene: PenScene | null = null
let pendingRender: Timer | null = null

// Several animations update per frame; they share one render on the next engine tick.
function requestRender() {
  if (pendingRender || !scene) return
  pendingRender = sync(() => {
    pendingRender = null
    scene?.render()
  })
}

// The pen flies in over the two screens before the paper, whose writing pose then takes over.
const flight = useAnimeTimeline({
  autoplay: useScrub(approach, 'top top', 'top bottom', requestRender),
  defaults: { duration: SECTION, ease: 'inOut(3)' },
})

const { position, rotation } = state

flight
  .add(scrollCtaText, { opacity: 0, duration: 250 }, 0)
  .add(position, { x: -10, ease: 'in(2)' }, 0)
  .add(rotation, { x: TAU * 0.25, y: 0, z: -TAU * 0.05, ease: 'inOut(2)' }, SECTION)
  .add(position, { x: -40, y: 0, z: -60, ease: 'inOut(2)' }, SECTION)

function write(writing: Writing) {
  Object.assign(state.writing, writing)
  requestRender()
}

const intro = useAnimeTimeline({ autoplay: false, defaults: { duration: 500, ease: 'out(2)' } })
intro
  .add(canvas, { x: ['50%', '0%'], opacity: [0, 1], duration: 1000 }, 0)
  .add(scrollCta, { opacity: 1 }, 0)

const paint = useSceneColors(colors => scene?.setColors(colors))

function onResize() {
  scene?.resize()
}

onMounted(() => {
  if (!canvas.value) return
  scene = createPenScene(canvas.value, state)
  scene.resize()
  paint()
  window.addEventListener('resize', onResize)
  intro.play()
})

onBeforeUnmount(() => {
  pendingRender?.cancel()
  window.removeEventListener('resize', onResize)
  scene?.dispose()
  scene = null
})
</script>

<template>
  <div class="min-h-screen overflow-x-clip bg-default font-sans text-[2vw] text-muted max-[500px]:text-[14px] min-[800px]:text-[16px]">
    <canvas
      ref="canvas"
      class="pointer-events-none fixed top-0 left-0 z-2 opacity-0"
    />

    <div class="relative z-1">
      <div ref="approach">
        <ShowcasePensSection
          title="Pens."
          heading="h1"
        >
          <h3 class="text-[4vw] font-normal text-default max-[500px]:text-[20px] min-[800px]:text-[32px]">
            The beginner's guide.
          </h3>
          <p class="my-[1em]">
            In case you haven't held one in a while.
          </p>
          <ShowcasePensCredits />
          <div
            ref="scrollCta"
            class="absolute bottom-[10vmin] text-[4vw] text-default opacity-0 max-[500px]:text-[20px] min-[800px]:text-[32px]"
          >
            <span ref="scrollCtaText">Scroll</span>
          </div>
        </ShowcasePensSection>

        <ShowcasePensSection
          title="They're a bit like keyboards..."
          align="right"
        />
      </div>

      <ShowcasePensPaper @write="write" />
    </div>
  </div>
</template>
