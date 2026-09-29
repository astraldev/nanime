<script setup lang="ts">
import { animate } from 'animejs/animation'
import { stagger } from '#nanime/utils'
import { spring } from '#nanime/easings'
import ExampleWrapper from '../../../shared/ExampleWrapper.vue'

const DURATION = 2500
const EASES = [
  'outQuad',
  'inOutSine',
  'outBounce',
  'inOutExpo',
  'outCubic',
  spring({ bounce: 0.5 }),
  spring({ stiffness: 120, damping: 8 }),
]

const isSmall = shallowRef(false)
let query: MediaQueryList | undefined
function updateIsSmall() {
  if (query) isSmall.value = query.matches
}

const COLS = computed(() => isSmall.value ? 10 : 18)
const ROWS = computed(() => isSmall.value ? 4 : 6)

const FROMS = computed<Array<'center' | 'first' | 'last' | 'random' | number[]>>(() => [
  'center',
  'first',
  'last',
  'random',
  [0, 0],
  [COLS.value - 1, 0],
  [0, ROWS.value - 1],
  [COLS.value - 1, ROWS.value - 1],
])

const easeIndex = ref(0)
const fromIndex = ref(0)

const boxes = useTemplateRef('boxes')

useAnimate(boxes, () => ({
  opacity: [0, 1, 0],
  boxShadow: [
    { to: '0 0 1rem 0 currentColor' },
    { to: '0 0 0rem 0 currentColor' },
    { to: '0 0 0.5rem 0 currentColor' },
  ],
  delay: stagger(250, {
    grid: [COLS.value, ROWS.value],
    from: FROMS.value[fromIndex.value % FROMS.value.length] ?? 'center',
  }),
  duration: DURATION,
  playbackEase: EASES[easeIndex.value % EASES.length] ?? 'outQuad',
  alternate: true,
  onComplete: () => {
    easeIndex.value++
    fromIndex.value++
  },
}))

function lightUp(event: PointerEvent) {
  const cell = event.currentTarget
  if (!(cell instanceof HTMLElement) || !cell.lastElementChild) return
  animate(cell.lastElementChild, {
    opacity: [1, 0],
    duration: 900,
    ease: 'outQuad',
  })
}

onMounted(() => {
  query = window.matchMedia('(max-width: 640px)')
  updateIsSmall()
  query.addEventListener('change', updateIsSmall)
})

onUnmounted(() => {
  query?.removeEventListener('change', updateIsSmall)
})
</script>

<template>
  <ExampleWrapper :resizable="false">
    <div
      class="grid place-items-center p-2.5 text-primary/30 [--s:calc(var(--spacing)*6)] md:[--s:calc(var(--spacing)*8)] w-full"
      :style="{ gridTemplateColumns: `repeat(${COLS}, minmax(var(--s), 1fr))` }"
    >
      <div
        v-for="i in COLS * ROWS"
        :key="i"
        class="relative aspect-square w-full"
        @pointerenter="lightUp"
      >
        <div
          ref="boxes"
          class="bg-white/[.035] border border-primary/5 size-full opacity-0 pointer-events-none"
        />
        <div class="absolute inset-0 bg-primary/50 shadow-[0_0_1rem_0_currentColor] opacity-0 pointer-events-none" />
      </div>
    </div>
  </ExampleWrapper>
</template>
