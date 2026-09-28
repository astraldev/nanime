<script setup lang="ts">
import { spring } from '#nanime/easings'
import { kindStyles, type DriveFile, type DriveLayout } from '~/examples/drive/files'

interface Point {
  x: number
  y: number
}

interface Size {
  width: number
  height: number
}

const props = defineProps<{
  file: DriveFile
  layout: DriveLayout
  expanded: boolean
  trash: () => HTMLElement | null
}>()

const emit = defineEmits<{
  over: [value: boolean]
  trashed: []
  toggle: []
}>()

const trashPadding = 6

const releaseEase = spring({ bounce: 0.1, duration: 400 })

const fillParams = {
  progress: { duration: 250, ease: 'out(3)' },
}

const dropAnimation = {
  opacity: 0,
  duration: 150,
  ease: 'out(2)',
}

const handle = useTemplateRef('handle')
const overTrash = ref(false)
const dropped = ref(false)
const lifted = ref(false)
const fill = reactive({ progress: 0 })
const toTrash = shallowRef<Point>({ x: 0, y: 0 })
const cardSize = shallowRef<Size>({ width: 0, height: 0 })
const trashSize = shallowRef<Size>({ width: 0, height: 0 })
let trashRect: DOMRect | null = null
let restCentre: Point = { x: 0, y: 0 }
let restPointer: Point = { x: 0, y: 0 }

const draggable = useDraggable(handle, {
  snap: [0],
  releaseEase,
  onGrab: measure,
  onUpdate: trackTrash,
  onRelease: dropInTrash,
  onSettle: land,
})

const fillTo = useAnimatable(fill, fillParams)

const fillStyle = computed(() => {
  const progress = fill.progress
  if (!progress) return {}
  const { width, height } = cardSize.value
  const grownWidth = width + (trashSize.value.width - width) * progress
  const grownHeight = height + (trashSize.value.height - height) * progress
  const x = toTrash.value.x * progress - (grownWidth - width) / 2
  const y = toTrash.value.y * progress - (grownHeight - height) / 2
  return {
    width: `${grownWidth}px`,
    height: `${grownHeight}px`,
    transform: `translate(${x}px, ${y}px)`,
  }
})

const slotClasses: Record<DriveLayout, { normal: string, expanded: string }> = {
  grid: { normal: '', expanded: 'col-span-2 row-span-2' },
  list: { normal: 'h-14 w-full', expanded: 'h-20 w-full' },
  columns: { normal: 'mb-3 w-full break-inside-avoid', expanded: 'mb-3 h-44 w-full break-inside-avoid' },
}

const cardClasses: Record<DriveLayout, string> = {
  grid: 'flex-col items-center justify-center gap-1.5 p-3 text-xs sm:text-sm',
  list: 'items-center gap-3 px-4 text-sm',
  columns: 'flex-col items-center justify-center gap-1.5 p-3 text-xs sm:text-sm',
}

const columnHeights = ['h-20', 'h-28', 'h-24']

const tint = computed(() => kindStyles[props.file.kind])

const slotClass = computed(() => {
  const classes = slotClasses[props.layout]
  if (props.expanded) return classes.expanded
  if (props.layout === 'columns') return `${classes.normal} ${columnHeights[props.file.id % columnHeights.length]}`
  return classes.normal
})

const showDetails = computed(() => props.expanded || props.layout === 'list')

function centreOf(rect: DOMRect): Point {
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
}

function rememberGrab(event: PointerEvent) {
  restPointer = { x: event.clientX - draggable.x, y: event.clientY - draggable.y }
}

function measure() {
  const rect = handle.value?.getBoundingClientRect()
  lifted.value = true
  const trash = props.trash()
  if (!rect || !trash) return
  trashRect = trash.getBoundingClientRect()
  const centre = centreOf(rect)
  restCentre = { x: centre.x - draggable.x, y: centre.y - draggable.y }
  cardSize.value = { width: rect.width, height: rect.height }
  trashSize.value = { width: trashRect.width - trashPadding * 2, height: trashRect.height - trashPadding * 2 }
}

function isInsideTrash({ x, y }: Point) {
  if (!trashRect) return false
  return x > trashRect.left && x < trashRect.right && y > trashRect.top && y < trashRect.bottom
}

function setOverTrash(value: boolean) {
  if (value === overTrash.value) return
  overTrash.value = value
  fillTo.progress?.(value ? 1 : 0)
  emit('over', value)
}

function trackTrash() {
  const over = isInsideTrash({ x: restPointer.x + draggable.x, y: restPointer.y + draggable.y })
  if (over && trashRect) {
    const trashCentre = centreOf(trashRect)
    toTrash.value = {
      x: trashCentre.x - (restCentre.x + draggable.x),
      y: trashCentre.y - (restCentre.y + draggable.y),
    }
  }
  setOverTrash(over)
}

function land() {
  lifted.value = false
}

function dropInTrash() {
  if (!overTrash.value) return
  draggable.stop()
  emit('over', false)
  dropped.value = true
}
</script>

<template>
  <li
    class="relative rounded-lg bg-elevated/60"
    :class="[slotClass, { 'z-20': lifted }]"
  >
    <AnimeTransition
      :leave-animation="dropAnimation"
      @after-leave="emit('trashed')"
    >
      <div
        v-if="!dropped"
        ref="handle"
        class="absolute inset-0 cursor-grab touch-none select-none active:cursor-grabbing"
        @pointerdown="rememberGrab"
        @click="emit('toggle')"
      >
        <div
          class="absolute inset-0 flex overflow-hidden rounded-lg ring-1 ring-default backdrop-blur-md"
          :class="[tint.tint, cardClasses[layout]]"
          :style="fillStyle"
        >
          <UIcon
            :name="tint.icon"
            class="shrink-0"
            :class="layout === 'list' ? 'size-6' : expanded ? 'size-12' : 'size-7'"
          />
          <div
            class="flex max-w-full min-w-0 flex-col gap-0.5"
            :class="layout === 'list' ? 'items-start' : 'items-center'"
          >
            <span class="max-w-full truncate font-medium">{{ file.name }}</span>
            <span
              class="max-w-full truncate text-xs opacity-70"
              :class="{ hidden: !showDetails }"
            >{{ tint.label }} · {{ file.modified }}</span>
          </div>
          <span
            class="shrink-0 tabular-nums opacity-70"
            :class="[{ hidden: !showDetails }, { 'ml-auto': layout === 'list' }]"
          >{{ file.size }} MB</span>
        </div>
      </div>
    </AnimeTransition>
  </li>
</template>
