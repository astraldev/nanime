<script setup lang="ts">
import { random, stagger } from '#nanime/utils'
import { spring } from '#nanime/easings'
import ExampleWrapper from '../../../shared/ExampleWrapper.vue'

const DURATION = 5000
const EASES = [
  'outQuad',
  'inOutSine',
  'outElastic(1, .6)',
  'outBack',
  'inOutCirc',
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
  scale: [{ to: [0, 1.25] }, { to: 0 }],
  translateX: [{ to: () => random(-6, 6) }, { to: 0 }],
  translateY: [{ to: () => random(-6, 6) }, { to: 0 }],
  boxShadow: [
    { to: '0 0 1rem 0 currentColor' },
    { to: '0 0 0rem 0 currentColor' },
  ],
  delay: stagger(60, {
    grid: [COLS.value, ROWS.value],
    from: FROMS.value[fromIndex.value % FROMS.value.length] ?? 'center',
  }),
  duration: DURATION,
  playbackEase: EASES[easeIndex.value % EASES.length] ?? 'outQuad',
  loop: true,
  onLoop: () => {
    easeIndex.value++
    fromIndex.value++
  },
}))

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
      class="grid place-items-center gap-0.5 p-5 text-primary/30"
      :style="{ gridTemplateColumns: `repeat(${COLS}, minmax(0,1fr))` }"
    >
      <div
        v-for="i in COLS * ROWS"
        :key="i"
        ref="boxes"
        class="size-5 md:size-6 rounded-sm bg-primary/30 border border-primary/20 shadow-sm aspect-square"
      />
    </div>
  </ExampleWrapper>
</template>
