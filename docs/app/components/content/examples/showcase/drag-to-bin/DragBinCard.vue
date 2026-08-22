<script setup lang="ts">
import { spring } from '#nanime/easings'

const props = withDefaults(defineProps<{
  label: string
  binned: boolean
  bin?: HTMLElement | null
  padding?: number
}>(), { padding: 5 })

const emit = defineEmits<{
  bin: []
  over: [value: boolean]
}>()

const el = useTemplateRef('el')
const over = ref(false)

/** Anime drives the blend; the box and the stick offset are interpolated from it. */
const blend = reactive({ p: 0 })
const blendTo = useAnimatable(blend, { p: 0, duration: 350, ease: 'outQuad' })

type Box = {
  width: number
  height: number
  deltaW: number
  deltaH: number
  halfDeltaW: number
  halfDeltaH: number
}

type Geometry = {
  originX: number
  originY: number
  binCenterX: number
  binCenterY: number
  bin: DOMRect
}

const box = shallowRef<Box | null>(null)

/** Vector from the handle's centre to the bin's centre, while over the bin. */
const stick = shallowRef({ x: 0, y: 0 })

let geometry: Geometry | null = null

const style = computed(() => {
  // At rest the card takes its size from the handle, so no inline box can go stale.
  if (!box.value || !blend.p) return {}

  const { width, height, deltaW, deltaH, halfDeltaW, halfDeltaH } = box.value
  const p = blend.p
  const w = width + p * deltaW
  const h = height + p * deltaH

  // Keeps the card centred on the handle as it resizes toward the bin
  const x = p * (stick.value.x - halfDeltaW)
  const y = p * (stick.value.y - halfDeltaH)

  return {
    width: `${w}px`,
    height: `${h}px`,
    transform: `translate(${x}px, ${y}px)`,
  }
})

function report(value: boolean) {
  if (over.value === value) return

  over.value = value
  blendTo.p?.(value ? 1 : 0)
  emit('over', value)
}

const draggable = useDraggable(el, {
  snap: [0],
  releaseEase: spring({ bounce: 0.2, duration: 500 }),
  onGrab: (self) => {
    const node = el.value
    const ghost = node?.parentElement

    if (!node || !ghost || !props.bin) return

    // Measured once per grab: ghost provides the static un-transformed rest origin
    const bin = props.bin.getBoundingClientRect()
    const rest = ghost.getBoundingClientRect()
    const width = rest.width
    const height = rest.height

    if (!width || !height || !bin.width || !bin.height) return

    const deltaW = bin.width - props.padding * 2 - width
    const deltaH = bin.height - props.padding * 2 - height

    box.value = {
      width,
      height,
      deltaW,
      deltaH,
      halfDeltaW: deltaW / 2,
      halfDeltaH: deltaH / 2,
    }

    geometry = {
      originX: rest.left + width / 2 - self.x,
      originY: rest.top + height / 2 - self.y,
      binCenterX: bin.left + bin.width / 2,
      binCenterY: bin.top + bin.height / 2,
      bin,
    }
  },
  onUpdate: (self) => {
    if (!geometry) return

    const { originX, originY, binCenterX, binCenterY, bin } = geometry
    const x = originX + self.x
    const y = originY + self.y
    const isOver = x > bin.left && x < bin.right && y > bin.top && y < bin.bottom

    report(isOver)

    if (isOver) {
      stick.value = {
        x: binCenterX - x,
        y: binCenterY - y,
      }
    }
  },
  onRelease: () => {
    if (over.value) {
      draggable.stop?.()
      emit('bin')
    }
  },
})

watch(() => props.binned, (value) => {
  if (value) return

  report(false)
  blend.p = 0
  stick.value = { x: 0, y: 0 }
  draggable.reset?.()
})
</script>

<template>
  <div
    ref="el"
    class="handle"
  >
    <div
      class="card"
      :style="style"
    >
      {{ label }}
    </div>
  </div>
</template>

<style scoped>
@reference "~/assets/css/main.css";

.handle {
  @apply absolute top-0 left-0 w-full h-12 select-none;
  @apply cursor-grab active:cursor-grabbing;
  touch-action: none;
}

.card {
  @apply w-full h-full rounded-lg border border-primary/20 bg-primary/5 backdrop-blur-md;
  @apply grid place-items-center text-sm font-semibold text-highlighted select-none;

  will-change: transform;
  transition: opacity 300ms ease-out;
}

:global(.is-binned) .card {
  opacity: 0;
  z-index: 10;
}

@media (prefers-reduced-motion: reduce) {
  .card {
    transition: none;
  }
}
</style>
