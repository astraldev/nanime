<script setup lang="ts">
import { cubicBezier } from '#nanime/easings'
import { clamp, lerp, mapRange } from '#nanime/utils'
import type { Writing } from '~/showcase/pens/scene'
import { useDrawable, useScrub } from '~/showcase/pens/scroll'

// The paper scrubs over this many screens of scroll: its four screens, less the last one on show.
const SCROLL = 3
// Milestones, in screens of that scroll: the pen reaches the page, writes the word, lifts over to
// the i and dots it, then lifts again and comes to rest under the word for the last screen.
const LANDED = 0.2 / SCROLL
const WRITTEN = 1.8 / SCROLL
const OVER_DOT = 2.1 / SCROLL
const DOTTED = 2.2 / SCROLL
const RESTED = 2.7 / SCROLL
// The i's dot, in the handwriting's viewBox.
const DOT = { x: 223, y: 72 }
// From the word's bottom to the resting pen's middle, as a share of the screen height, which the pen's size follows.
const REST_GAP = 0.09
// How high the nib rises between marks, in scene units.
const LIFT = 10

const smooth = cubicBezier(1 / 3, 0, 2 / 3, 1)

const emit = defineEmits<{
  write: [writing: Writing]
}>()

const paper = useTemplateRef<HTMLElement>('paper')
const ruling = useTemplateRef<HTMLElement>('ruling')
const stroke = useTemplateRef<SVGPathElement>('stroke')
const dot = useTemplateRef<SVGCircleElement>('dot')

// The ruling drifts down as the paper scrolls; it starts above the paper so its top edge never shows.
useAnimate(ruling, { y: '30%', ease: 'out(2)', autoplay: useScrub(paper, 'bottom top', 'top bottom') })

function phase(progress: number, from: number, to: number) {
  return clamp(mapRange(progress, from, to, 0, 1), 0, 1)
}

function penAt(progress: number): Writing | null {
  const path = stroke.value
  const matrix = path?.getScreenCTM()
  if (!path || !matrix) return null
  const inked = path.getPointAtLength(phase(progress, LANDED, WRITTEN) * path.getTotalLength()).matrixTransform(matrix)
  const dotted = new DOMPoint(DOT.x, DOT.y).matrixTransform(matrix)
  const word = path.getBoundingClientRect()
  const rest = { x: (word.left + word.right) / 2, y: word.bottom + window.innerHeight * REST_GAP }
  const toDot = phase(progress, WRITTEN, OVER_DOT)
  const toRest = phase(progress, DOTTED, RESTED)
  return {
    x: lerp(lerp(inked.x, dotted.x, smooth(toDot)), rest.x, smooth(toRest)),
    y: lerp(lerp(inked.y, dotted.y, smooth(toDot)), rest.y, smooth(toRest)),
    weight: smooth(phase(progress, 0, LANDED)),
    lift: LIFT * (Math.sin(Math.PI * toDot) + Math.sin(Math.PI * toRest)),
    resting: smooth(toRest),
  }
}

// While the paper fills the screen the pen leaves its flight path and its nib follows the ink.
const handwriting = useAnimeTimeline({
  autoplay: useScrub(paper, 'top top', 'bottom bottom', ({ progress }) => {
    const writing = penAt(progress)
    if (writing) emit('write', writing)
  }),
  defaults: { ease: 'linear' },
})

handwriting
  .add(useDrawable(stroke), {
    draw: [
      { from: '0 0', to: '0 0', duration: LANDED },
      { to: '0 1', duration: WRITTEN - LANDED },
      { to: '0 1', duration: 1 - WRITTEN },
    ],
  }, 0)
  .add(dot, {
    scale: [
      { from: 0, to: 0, duration: OVER_DOT },
      { to: 1, duration: DOTTED - OVER_DOT, ease: 'outBack(3)' },
      { to: 1, duration: 1 - DOTTED },
    ],
  }, 0)
</script>

<template>
  <div
    ref="paper"
    class="relative overflow-clip bg-muted"
  >
    <div
      ref="ruling"
      class="ruling absolute inset-x-0 -top-[15%] -bottom-[100px]"
    />
    <div class="pointer-events-none absolute inset-0 z-1">
      <div class="sticky top-0 flex h-screen items-center justify-center">
        <svg
          class="w-[min(70vw,900px)] fill-none stroke-primary stroke-4"
          viewBox="0 0 390 200"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path
            ref="stroke"
            d="M 20 150 C 30 130 38 100 42 92 C 44 120 44 140 44 150 C 50 110 60 90 72 92 C 84 94 84 130 86 150 C 90 150 96 140 104 120 C 110 100 124 90 132 96 C 140 102 122 150 108 148 C 96 146 106 112 128 100 C 134 96 136 92 138 92 C 134 115 134 140 140 150 C 150 130 156 100 160 92 C 162 120 162 140 162 150 C 168 110 178 90 190 92 C 202 94 202 130 204 150 C 210 150 216 130 222 96 C 222 120 222 140 228 150 C 236 130 242 100 246 92 C 248 120 248 140 248 150 C 252 110 260 90 270 92 C 280 94 280 130 280 150 C 284 110 292 90 302 92 C 312 94 312 130 314 150 C 322 150 336 136 346 120 C 356 104 350 90 340 92 C 326 96 322 130 332 146 C 340 156 358 152 372 140"
          />
          <!-- Hidden by the attribute until AnimeJS takes over the transform. -->
          <circle
            ref="dot"
            class="origin-center fill-primary stroke-none [transform-box:fill-box]"
            :cx="DOT.x"
            :cy="DOT.y"
            r="3.5"
            transform="scale(0)"
          />
        </svg>
      </div>
    </div>

    <ShowcasePensSection
      title="...except there's only one key."
      text="And you have to drag it around yourself."
      align="right"
    />
    <ShowcasePensSection
      title="They leave a trail of ink."
      text="No backspace, though."
    />
    <ShowcasePensSection
      title="No battery required."
      text="Not even a charging cable."
      align="right"
    />
    <!-- The finished word, with the pen at rest. -->
    <div class="h-screen" />
  </div>
</template>

<style scoped>
/* A margin rule and ruled lines. overflow: clip on the paper, unlike hidden, keeps the writing layer sticky. */
.ruling {
  background-image:
    linear-gradient(90deg, transparent 0 12vw, color-mix(in oklab, var(--color-primary) 45%, transparent) 12vw calc(12vw + 2px), transparent calc(12vw + 2px)),
    repeating-linear-gradient(transparent 0 39px, color-mix(in oklab, var(--ui-text) 12%, transparent) 39px 40px);
}
</style>
