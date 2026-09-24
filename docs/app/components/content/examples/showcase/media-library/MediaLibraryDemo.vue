<script setup lang="ts">
import { spring } from '#nanime/easings'
import { shuffle, stagger } from '#nanime/utils'
import ExampleWrapper, { type ExampleAction } from '~/components/shared/ExampleWrapper.vue'

type Kind = 'image' | 'video' | 'audio'
type Layout = 'row' | 'grid' | 'list' | 'columns'

interface MediaItem {
  id: number
  kind: Kind
}

interface Step {
  label: string
  run: () => void
}

const kinds: Kind[] = ['image', 'video', 'audio']

const kindStyles: Record<Kind, { icon: string, tint: string }> = {
  image: { icon: 'i-ph-image-fill', tint: 'bg-white/80 text-neutral-900' },
  video: { icon: 'i-ph-film-strip-fill', tint: 'bg-primary/80 text-neutral-900' },
  audio: { icon: 'i-ph-waveform-bold', tint: 'bg-neutral-900/80 text-white' },
}

const layoutClasses: Record<Layout, string> = {
  row: 'flex flex-wrap gap-2',
  grid: 'grid grid-cols-4 auto-rows-[3.5rem] grid-flow-dense gap-2',
  list: 'flex flex-col gap-1.5',
  columns: 'columns-3 gap-2',
}

const tileClasses: Record<Layout, { normal: string, expanded: string }> = {
  row: { normal: 'size-14 flex-col', expanded: 'size-30 flex-col' },
  grid: { normal: 'flex-col', expanded: 'col-span-2 row-span-2 flex-col' },
  list: { normal: 'h-9 w-full justify-start px-3', expanded: 'h-16 w-full justify-start px-4' },
  columns: { normal: 'mb-2 w-full break-inside-avoid flex-col', expanded: 'mb-2 h-32 w-full break-inside-avoid flex-col' },
}

const columnHeights = ['h-14', 'h-20', 'h-24']

const enterAnimation = {
  opacity: [0, 1],
  scale: [0, 1],
  ease: spring({ bounce: 0.4, duration: 500 }),
}

const leaveAnimation = {
  opacity: [1, 1, 0],
  scale: [1, 1.1, 0],
  duration: 400,
  ease: 'in(2)',
}

const moveAnimation = {
  delay: stagger(15),
  ease: spring({ bounce: 0.3, duration: 450 }),
}

function createItem(id: number): MediaItem {
  return { id, kind: kinds[(id - 1) % kinds.length] ?? 'image' }
}

const items = ref<MediaItem[]>([1, 2, 3, 4, 5, 6].map(createItem))
const layout = ref<Layout>('grid')
const filter = ref<Kind | 'all'>('all')
const expandedId = ref<number | null>(null)
let nextId = 7

const visibleItems = computed(() => items.value.filter(item => filter.value === 'all' || item.kind === filter.value))

function tileClass(item: MediaItem) {
  const classes = tileClasses[layout.value]
  if (item.id === expandedId.value) return classes.expanded
  if (layout.value === 'columns') return `${classes.normal} ${columnHeights[item.id % columnHeights.length]}`
  return classes.normal
}

function toggleExpanded(item: MediaItem) {
  expandedId.value = item.id === expandedId.value ? null : item.id
}

function setLayout(next: Layout) {
  layout.value = next
}

function setFilter(next: Kind | 'all') {
  filter.value = next
}

function add() {
  items.value.splice(2, 0, createItem(nextId++))
}

function remove() {
  items.value.shift()
}

function shuffleItems() {
  shuffle(items.value)
}

function sortByKind() {
  items.value.sort((a, b) => kinds.indexOf(a.kind) - kinds.indexOf(b.kind) || a.id - b.id)
}

const steps: Step[] = [
  { label: 'Row', run: () => setLayout('row') },
  { label: 'Grid', run: () => setLayout('grid') },
  { label: 'List', run: () => setLayout('list') },
  { label: 'Columns', run: () => setLayout('columns') },
  { label: 'Only images', run: () => setFilter('image') },
  { label: 'Show all', run: () => setFilter('all') },
  { label: 'Shuffle', run: shuffleItems },
  { label: 'Sort', run: sortByKind },
  { label: 'Add', run: add },
  { label: 'Remove', run: remove },
]

const stepIndex = ref(-1)
const playing = ref(true)
let timer: ReturnType<typeof setInterval> | undefined

function playNextStep() {
  if (!playing.value) return
  stepIndex.value = (stepIndex.value + 1) % steps.length
  steps[stepIndex.value]?.run()
}

function togglePlaying() {
  playing.value = !playing.value
}

onMounted(() => (timer = setInterval(playNextStep, 2800)))
onBeforeUnmount(() => clearInterval(timer))

const status = computed(() => {
  const current = steps[stepIndex.value]?.label ?? 'Ready'
  const next = steps[(stepIndex.value + 1) % steps.length]?.label
  return `${current} → next: ${next}`
})

const actions = computed<ExampleAction[]>(() => [
  { label: playing.value ? 'Pause' : 'Play', run: togglePlaying },
])
</script>

<template>
  <ExampleWrapper
    :actions="actions"
    :status="status"
    scramble-status
  >
    <div class="h-80">
      <AnimeTransitionGroup
        class="relative w-full max-w-sm"
        :class="layoutClasses[layout]"
        :enter-animation="enterAnimation"
        :leave-animation="leaveAnimation"
        :move-animation="moveAnimation"
      >
        <button
          v-for="item in visibleItems"
          :key="item.id"
          class="flex cursor-pointer items-center justify-center gap-2 rounded-lg text-xs font-semibold ring-1 ring-white/10 backdrop-blur-md"
          :class="[kindStyles[item.kind].tint, tileClass(item)]"
          @click="toggleExpanded(item)"
        >
          <UIcon
            :name="kindStyles[item.kind].icon"
            class="size-5 shrink-0"
          />
          <span>{{ item.id }}</span>
        </button>
      </AnimeTransitionGroup>
    </div>
  </ExampleWrapper>
</template>
