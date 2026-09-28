<script setup lang="ts">
import type { TrashedFile } from '~/examples/drive/useDrive'

defineProps<{
  toast: TrashedFile | null
}>()

const emit = defineEmits<{
  undo: []
}>()

const enterAnimation = {
  opacity: { from: 0 },
  x: { from: 20 },
  scale: { from: 0.65 },
  duration: 250,
  ease: 'out(3)',
}

const leaveAnimation = {
  opacity: { to: 0 },
  x: { to: 20 },
  scale: { to: 0.65 },
  duration: 150,
  ease: 'out(2)',
}
</script>

<template>
  <div class="pointer-events-none absolute inset-x-0 bottom-4 flex justify-end px-4">
    <AnimeTransition
      mode="out-in"
      :enter-animation="enterAnimation"
      :leave-animation="leaveAnimation"
    >
      <div
        v-if="toast"
        :key="toast.file.id"
        class="pointer-events-auto flex items-center gap-4 rounded-lg bg-inverted px-4 py-2.5 text-sm text-inverted shadow-lg"
      >
        <span class="truncate">Moved {{ toast.file.name }} to Trash</span>
        <button
          type="button"
          data-live="7"
          class="relative cursor-pointer font-semibold text-primary"
          @click="emit('undo')"
        >
          Undo
        </button>
      </div>
    </AnimeTransition>
  </div>
</template>
