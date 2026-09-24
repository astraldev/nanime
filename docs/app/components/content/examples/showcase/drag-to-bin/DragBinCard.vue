<script setup lang="ts">
import { spring } from '#nanime/easings'

interface Point {
  x: number
  y: number
}

interface Size {
  width: number
  height: number
}

const props = defineProps<{
  name: string
  icon: string
  bin: HTMLElement | null
}>()

const emit = defineEmits<{
  over: [value: boolean]
  binned: []
}>()

const binPadding = 6

const releaseEase = spring({ bounce: 0.35, duration: 500 })

const fillParams = {
  progress: { ease: spring({ bounce: 0.2, duration: 400 }) },
}

const dropAnimation = {
  opacity: 0,
  delay: 250,
  duration: 200,
  ease: 'out(2)',
}

const handle = useTemplateRef('handle')
const overBin = ref(false)
const dropped = ref(false)
const fill = reactive({ progress: 0 })
const toBin = shallowRef<Point>({ x: 0, y: 0 })
const cardSize = shallowRef<Size>({ width: 0, height: 0 })
const binSize = shallowRef<Size>({ width: 0, height: 0 })
let binRect: DOMRect | null = null
let restCentre: Point = { x: 0, y: 0 }

const draggable = useDraggable(handle, {
  snap: [0],
  releaseEase,
  onGrab: measure,
  onUpdate: trackBin,
  onRelease: dropInBin,
})

const fillTo = useAnimatable(fill, fillParams)

const fillStyle = computed(() => {
  const progress = fill.progress
  if (!progress) return {}
  const { width, height } = cardSize.value
  const grownWidth = width + (binSize.value.width - width) * progress
  const grownHeight = height + (binSize.value.height - height) * progress
  const x = toBin.value.x * progress - (grownWidth - width) / 2
  const y = toBin.value.y * progress - (grownHeight - height) / 2
  return {
    width: `${grownWidth}px`,
    height: `${grownHeight}px`,
    transform: `translate(${x}px, ${y}px)`,
  }
})

function centreOf(rect: DOMRect): Point {
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
}

function currentCentre(): Point {
  return { x: restCentre.x + draggable.x, y: restCentre.y + draggable.y }
}

function isInsideBin({ x, y }: Point) {
  if (!binRect) return false
  return x > binRect.left && x < binRect.right && y > binRect.top && y < binRect.bottom
}

function measure() {
  const rect = handle.value?.getBoundingClientRect()
  if (!rect || !props.bin) return
  binRect = props.bin.getBoundingClientRect()
  const centre = centreOf(rect)
  restCentre = { x: centre.x - draggable.x, y: centre.y - draggable.y }
  cardSize.value = { width: rect.width, height: rect.height }
  binSize.value = { width: binRect.width - binPadding * 2, height: binRect.height - binPadding * 2 }
}

function setOverBin(value: boolean) {
  if (value === overBin.value) return
  overBin.value = value
  fillTo.progress?.(value ? 1 : 0)
  emit('over', value)
}

function trackBin() {
  const centre = currentCentre()
  const over = isInsideBin(centre)
  if (over && binRect) {
    const binCentre = centreOf(binRect)
    toBin.value = { x: binCentre.x - centre.x, y: binCentre.y - centre.y }
  }
  setOverBin(over)
}

function dropInBin() {
  if (!overBin.value) return
  draggable.stop()
  emit('over', false)
  dropped.value = true
}
</script>

<template>
  <li class="relative h-16 w-12 shrink-0 rounded-lg bg-primary/10 sm:size-20">
    <AnimeTransition
      :leave-animation="dropAnimation"
      @after-leave="emit('binned')"
    >
      <div
        v-if="!dropped"
        ref="handle"
        class="absolute inset-0 cursor-grab touch-none select-none active:cursor-grabbing"
      >
        <div
          class="absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-lg bg-primary/80 px-1 text-[10px] font-semibold text-neutral-900 ring-1 ring-white/10 backdrop-blur-md"
          :style="fillStyle"
        >
          <UIcon
            :name="icon"
            class="size-6 shrink-0"
          />
          <span class="max-w-full truncate">{{ name }}</span>
        </div>
      </div>
    </AnimeTransition>
  </li>
</template>
