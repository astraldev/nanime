<script setup lang="ts">
import { spring } from '#nanime/easings'
import { stagger } from '#nanime/utils'
import type { DriveFile, DriveLayout } from '~/examples/drive/files'
import DriveTile from './DriveTile.vue'

defineProps<{
  files: DriveFile[]
  layout: DriveLayout
  expandedId: number | null
  trash: () => HTMLElement | null
}>()

const emit = defineEmits<{
  toggle: [file: DriveFile]
  over: [value: boolean]
  trashed: [file: DriveFile]
}>()

const groupClasses: Record<DriveLayout, string> = {
  grid: 'grid grid-cols-3 auto-rows-[5rem] grid-flow-dense gap-3 sm:grid-cols-4 lg:grid-cols-5 lg:auto-rows-[6.5rem]',
  list: 'flex flex-col gap-1.5',
  columns: 'columns-2 gap-3 sm:columns-3 lg:columns-4',
}

const enterAnimation = {
  opacity: [0, 1],
  scale: [0.9, 1],
  ease: spring({ bounce: 0.15, duration: 350 }),
}

const leaveAnimation = {
  opacity: 0,
  scale: 0.95,
  duration: 150,
  ease: 'out(2)',
}

const moveAnimation = {
  duration: 300,
  delay: stagger(8),
  ease: 'out(3)',
}
</script>

<template>
  <div class="min-h-0 flex-1 p-4">
    <AnimeTransitionGroup
      tag="ul"
      data-live="4"
      class="relative"
      :class="groupClasses[layout]"
      :enter-animation="enterAnimation"
      :leave-animation="leaveAnimation"
      :move-animation="moveAnimation"
    >
      <DriveTile
        v-for="file in files"
        :key="file.id"
        :file="file"
        :layout="layout"
        :expanded="file.id === expandedId"
        :trash="trash"
        @toggle="emit('toggle', file)"
        @over="emit('over', $event)"
        @trashed="emit('trashed', file)"
      />
    </AnimeTransitionGroup>
  </div>
</template>
