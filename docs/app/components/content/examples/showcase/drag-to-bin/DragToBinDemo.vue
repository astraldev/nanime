<script setup lang="ts">
import { spring } from '#nanime/easings'
import ExampleWrapper, { type ExampleAction } from '~/components/shared/ExampleWrapper.vue'
import DragBinCard from './DragBinCard.vue'

interface BinFile {
  id: number
  name: string
  icon: string
}

const files: BinFile[] = [
  { id: 1, name: 'invoice', icon: 'i-ph-file-pdf-fill' },
  { id: 2, name: 'photo', icon: 'i-ph-image-fill' },
  { id: 3, name: 'notes', icon: 'i-ph-note-fill' },
  { id: 4, name: 'backup', icon: 'i-ph-file-zip-fill' },
]

const binTints = {
  idle: 'border-neutral-500/15 bg-neutral-500/10 text-muted',
  armed: 'border-neutral-500/25 bg-neutral-500/20 text-highlighted',
}

const enterAnimation = {
  opacity: [0, 1],
  scale: [0.6, 1],
  ease: spring({ bounce: 0.4, duration: 500 }),
}

const leaveAnimation = {
  opacity: 0,
  duration: 200,
  ease: 'out(2)',
}

const moveAnimation = {
  ease: spring({ bounce: 0.35, duration: 450 }),
}

const cards = ref<BinFile[]>([...files])
const binArmed = ref(false)
const bin = useTemplateRef('bin')

const status = computed(() => `${cards.value.length} of ${files.length} left`)

function setBinArmed(armed: boolean) {
  binArmed.value = armed
}

function removeCard(id: number) {
  cards.value = cards.value.filter(card => card.id !== id)
}

function restore() {
  cards.value = [...files]
}

const actions: ExampleAction[] = [
  { label: 'Restore', run: restore },
]
</script>

<template>
  <ExampleWrapper
    :actions="actions"
    :status="status"
    scramble-status
  >
    <div class="grid h-28 grid-cols-[minmax(0,1fr)_5rem] gap-3 sm:grid-cols-[minmax(0,1fr)_8rem]">
      <AnimeTransitionGroup
        tag="ul"
        class="relative flex items-center gap-2"
        :enter-animation="enterAnimation"
        :leave-animation="leaveAnimation"
        :move-animation="moveAnimation"
      >
        <DragBinCard
          v-for="card in cards"
          :key="card.id"
          :name="card.name"
          :icon="card.icon"
          :bin="bin"
          @over="setBinArmed"
          @binned="removeCard(card.id)"
        />
      </AnimeTransitionGroup>

      <div
        ref="bin"
        class="flex flex-col items-center justify-center gap-1 rounded-lg border transition-colors"
        :class="binArmed ? binTints.armed : binTints.idle"
      >
        <UIcon
          name="i-ph-trash-fill"
          class="size-7"
        />
        <span class="text-xs">Drop here</span>
      </div>
    </div>
  </ExampleWrapper>
</template>
