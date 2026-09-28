<script setup lang="ts">
import { formatTime, type Track } from '~/examples/player/tracks'

defineProps<{
  playlist: Track[]
  currentId: number
  playing: boolean
}>()

const emit = defineEmits<{
  play: [track: Track]
  shuffle: []
}>()

const moveAnimation = {
  duration: 350,
  ease: 'out(3)',
}
</script>

<template>
  <aside class="flex min-w-0 flex-col gap-3 border-t border-default p-5 lg:border-t-0 lg:border-l">
    <div class="flex items-center justify-between">
      <h3 class="font-semibold text-highlighted">
        Playlist
      </h3>
      <button
        type="button"
        data-live="5"
        class="flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 text-sm text-muted hover:bg-elevated hover:text-default"
        @click="emit('shuffle')"
      >
        <UIcon
          name="i-ph-shuffle"
          class="size-4"
        />
        Shuffle
      </button>
    </div>

    <AnimeTransitionGroup
      tag="ul"
      data-live="4"
      class="relative flex flex-col gap-1"
      :move-animation="moveAnimation"
    >
      <li
        v-for="track in playlist"
        :key="track.id"
      >
        <button
          type="button"
          class="flex w-full cursor-pointer items-center gap-3 rounded-lg p-2 text-left transition-colors duration-200"
          :class="track.id === currentId ? 'bg-primary/10' : 'hover:bg-elevated/60'"
          @click="emit('play', track)"
        >
          <span class="grid size-10 shrink-0 place-items-center rounded-md bg-primary/15 text-primary">
            <UIcon
              :name="track.id === currentId && playing ? 'i-ph-speaker-high-fill' : track.icon"
              class="size-5"
            />
          </span>
          <span class="flex min-w-0 flex-1 flex-col">
            <span
              class="truncate text-sm font-medium transition-colors duration-200"
              :class="track.id === currentId ? 'text-primary' : 'text-highlighted'"
            >{{ track.title }}</span>
            <span class="truncate text-xs text-muted">{{ track.artist }}</span>
          </span>
          <span class="text-xs text-muted tabular-nums">{{ formatTime(track.duration) }}</span>
        </button>
      </li>
    </AnimeTransitionGroup>
  </aside>
</template>
