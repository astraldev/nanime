<script setup lang="ts">
import { spring } from '#nanime/easings'
import { formatTime, type Track } from '~/examples/player/tracks'
import PlayerLevels from './PlayerLevels.vue'
import PlayerSlider from './PlayerSlider.vue'

const props = defineProps<{
  track: Track
  playing: boolean
  time: number
  volume: number
}>()

const emit = defineEmits<{
  togglePlay: []
  next: []
  previous: []
  seek: [fraction: number]
  volume: [fraction: number]
}>()

const disabledActions = [
  { label: 'Like', icon: 'i-ph-heart' },
  { label: 'Repeat', icon: 'i-ph-repeat' },
  { label: 'Lyrics', icon: 'i-ph-quotes' },
  { label: 'Cast', icon: 'i-ph-screencast' },
]

const iconEnter = {
  opacity: [0, 1],
  scale: [0.6, 1],
  ease: spring({ bounce: 0.2, duration: 250 }),
}

const iconLeave = {
  opacity: 0,
  scale: 0.6,
  duration: 100,
  ease: 'out(2)',
}

const coverFade = {
  opacity: [0, 1],
  duration: 400,
  ease: 'inOut(2)',
}

const coverFadeOut = {
  opacity: 0,
  duration: 400,
  ease: 'inOut(2)',
}

const title = useTemplateRef('title')
const meta = useTemplateRef('meta')
const total = useTemplateRef('total')
const seekPreview = ref<number | null>(null)

useScrambleText(title, {}, () => ({
  text: props.track.title,
  settleDuration: 300,
  revealRate: 40,
}))

const trackChange = useAnimeTimeline({ autoplay: false, defaults: { ease: 'out(3)', duration: 300 } })
trackChange
  .add(meta, { opacity: [0, 1] }, 150)
  .add(total, { opacity: [0, 1] }, 250)

watch(() => props.track.id, () => trackChange.restart())

const progress = computed(() => props.time / props.track.duration)
const shownTime = computed(() => (seekPreview.value ?? progress.value) * props.track.duration)

function previewSeek(fraction: number) {
  seekPreview.value = fraction
}

function commitSeek(fraction: number) {
  seekPreview.value = null
  emit('seek', fraction)
}

function setVolume(fraction: number) {
  emit('volume', fraction)
}
</script>

<template>
  <section class="flex min-w-0 flex-col gap-6 p-5 sm:p-6">
    <div class="flex flex-col gap-5 sm:flex-row sm:items-end">
      <div class="relative size-40 shrink-0 overflow-hidden rounded-2xl shadow-lg">
        <AnimeTransition
          :enter-animation="coverFade"
          :leave-animation="coverFadeOut"
        >
          <div
            :key="track.id"
            class="absolute inset-0 grid place-items-center text-white"
            :class="track.cover"
          >
            <UIcon
              :name="track.icon"
              class="size-16"
            />
          </div>
        </AnimeTransition>
      </div>

      <div class="flex min-w-0 flex-col gap-2">
        <span class="text-xs font-semibold tracking-wider text-muted uppercase">Now playing</span>
        <h2
          v-once
          ref="title"
          class="truncate text-2xl font-semibold text-highlighted sm:text-3xl"
        >
          {{ track.title }}
        </h2>
        <p
          ref="meta"
          class="truncate text-sm text-muted"
        >
          {{ track.artist }} · {{ track.album }}
        </p>
        <PlayerLevels
          :playing="playing"
          :volume="volume"
          class="mt-2"
        />
      </div>
    </div>

    <div
      data-live="1"
      class="flex flex-col gap-1.5"
    >
      <PlayerSlider
        :value="progress"
        label="Seek"
        @input="previewSeek"
        @change="commitSeek"
      />
      <div class="flex justify-between px-1 text-xs text-muted tabular-nums">
        <span>{{ formatTime(shownTime) }}</span>
        <span ref="total">{{ formatTime(track.duration) }}</span>
      </div>
    </div>

    <div class="flex flex-wrap items-center justify-between gap-4">
      <div
        data-live="2"
        class="flex items-center gap-2"
      >
        <button
          type="button"
          aria-label="Previous"
          class="grid size-10 cursor-pointer place-items-center rounded-full text-default hover:bg-elevated"
          @click="emit('previous')"
        >
          <UIcon
            name="i-ph-skip-back-fill"
            class="size-5"
          />
        </button>
        <button
          type="button"
          :aria-label="playing ? 'Pause' : 'Play'"
          class="grid size-12 cursor-pointer place-items-center rounded-full bg-primary text-white active:scale-95"
          @click="emit('togglePlay')"
        >
          <AnimeTransition
            mode="out-in"
            :enter-animation="iconEnter"
            :leave-animation="iconLeave"
          >
            <span
              v-if="playing"
              key="pause"
              class="flex"
            >
              <UIcon
                name="i-ph-pause-fill"
                class="size-6"
              />
            </span>
            <span
              v-else
              key="play"
              class="flex"
            >
              <UIcon
                name="i-ph-play-fill"
                class="size-6"
              />
            </span>
          </AnimeTransition>
        </button>
        <button
          type="button"
          aria-label="Next"
          class="grid size-10 cursor-pointer place-items-center rounded-full text-default hover:bg-elevated"
          @click="emit('next')"
        >
          <UIcon
            name="i-ph-skip-forward-fill"
            class="size-5"
          />
        </button>
      </div>

      <div
        data-live="3"
        class="flex w-40 items-center gap-2"
      >
        <UIcon
          :name="volume > 0.5 ? 'i-ph-speaker-high' : volume > 0 ? 'i-ph-speaker-low' : 'i-ph-speaker-x'"
          class="size-5 shrink-0 text-muted"
        />
        <PlayerSlider
          :value="volume"
          label="Volume"
          @input="setVolume"
          @change="setVolume"
        />
      </div>
    </div>

    <div class="flex gap-1 border-t border-default pt-4">
      <button
        v-for="action in disabledActions"
        :key="action.label"
        type="button"
        disabled
        :aria-label="action.label"
        title="Not part of this example"
        class="grid size-9 place-items-center rounded-lg text-muted disabled:cursor-not-allowed disabled:opacity-40"
      >
        <UIcon
          :name="action.icon"
          class="size-5"
        />
      </button>
    </div>
  </section>
</template>
