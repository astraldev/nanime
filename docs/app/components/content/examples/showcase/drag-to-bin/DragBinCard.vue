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

type Box = { width: number, height: number, binWidth: number, binHeight: number }
type Geometry = { x: number, y: number, grabX: number, grabY: number, bin: DOMRect }

const box = ref<Box | null>(null)

/** Vector from the handle's centre to the bin's centre, while over the bin. */
const stick = ref({ x: 0, y: 0 })

let geometry: Geometry | null = null

const style = computed(() => {
  // At rest the card takes its size from the handle, so no inline box can go stale.
  if (!box.value || !blend.p) return {}

  const { width, height, binWidth, binHeight } = box.value
  const w = width + blend.p * (binWidth - width)
  const h = height + blend.p * (binHeight - height)

  // (width - w) / 2 keeps the card centred on the handle as it resizes.
  const x = (width - w) / 2 + blend.p * stick.value.x
  const y = (height - h) / 2 + blend.p * stick.value.y

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
  releaseEase: spring({ bounce: 0.2, duration: 500 }),
  onGrab: (self) => {
    const node = el.value
    const ghost = node?.parentElement

    if (!node || !ghost || !props.bin) return

    // Measured once per grab: nothing in the list moves until the card is released.
    const bin = props.bin.getBoundingClientRect()
    const rest = ghost.getBoundingClientRect()
    const width = node.offsetWidth
    const height = node.offsetHeight

    if (!width || !height || !bin.width || !bin.height) return

    box.value = {
      width,
      height,
      binWidth: bin.width - props.padding * 2,
      binHeight: bin.height - props.padding * 2,
    }

    // self.x is whatever translate already exists — it is not necessarily zero.
    geometry = {
      x: rest.left + width / 2,
      y: rest.top + height / 2,
      grabX: self.x,
      grabY: self.y,
      bin,
    }
  },
  onUpdate: (self) => {
    if (!geometry) return

    const { x: restX, y: restY, grabX, grabY, bin } = geometry
    const x = restX + (self.x - grabX)
    const y = restY + (self.y - grabY)
    const isOver = x > bin.left && x < bin.right && y > bin.top && y < bin.bottom

    report(isOver)

    // Only tracked while it matters — outside the bin the blend is zero anyway.
    if (isOver) {
      stick.value = {
        x: bin.left + bin.width / 2 - x,
        y: bin.top + bin.height / 2 - y,
      }
    }
  },
  onRelease: () => {
    if (over.value) return emit('bin')

    report(false)
    // reset() returns the handle instantly, so the offset has to go with it.
    blend.p = 0
    draggable.reset?.()
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
  @apply absolute top-0 left-0 w-1/2 h-12;
  @apply cursor-grab active:cursor-grabbing;
}

.card {
  @apply w-full h-full rounded-lg border border-primary/20 bg-primary/5;
  @apply grid place-items-center text-sm font-semibold text-highlighted select-none;

  transition: opacity var(--motion-standard) var(--motion-ease);
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
