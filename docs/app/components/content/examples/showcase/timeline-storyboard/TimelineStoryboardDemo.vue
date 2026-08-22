<script setup lang="ts">
import { cubicBezier } from '#nanime/easings'
import { stagger } from '#nanime/utils'
import ExampleWrapper, { type ExampleAction } from '~/components/shared/ExampleWrapper.vue'

const progress = ref(0)
const isPlaying = ref(false)

const easeSmooth = cubicBezier(0.4, 0, 0.2, 1)
const easePop = cubicBezier(0.34, 1.56, 0.64, 1)

// Track 1: Card 01 — The High Jumper
const tl1 = useAnimeTimeline({ autoplay: false })
tl1
  .add('.card-1 .story-box', {
    y: [
      { to: 8, duration: 180, ease: easeSmooth },
      { to: -52, duration: 420, ease: 'outQuad' },
      { to: 0, duration: 500, ease: 'outBounce' },
    ],
  })
  .add('.card-1 .story-box', {
    scaleX: [
      { to: 1.18, duration: 180, ease: easeSmooth },
      { to: 0.82, duration: 420, ease: 'outQuad' },
      { to: 1, duration: 500, ease: 'outBounce' },
    ],
    scaleY: [
      { to: 0.82, duration: 180, ease: easeSmooth },
      { to: 1.25, duration: 420, ease: 'outQuad' },
      { to: 1, duration: 500, ease: 'outBounce' },
    ],
  }, 0)

// Track 2: Card 02 — The Acrobat 360 Spin
const tl2 = useAnimeTimeline({ autoplay: false })
tl2
  .add('.card-2 .story-box', {
    y: [
      { to: -28, duration: 450, ease: 'outQuad' },
      { to: 0, duration: 450, ease: easePop },
    ],
  })
  .add('.card-2 .story-box', {
    rotate: [
      { to: -30, duration: 180, ease: easeSmooth },
      { to: 360, duration: 800, ease: easePop },
    ],
    scale: [
      { to: 0.85, duration: 180, ease: easeSmooth },
      { to: 1.28, duration: 400, ease: 'outQuad' },
      { to: 1, duration: 400, ease: easePop },
    ],
  }, 0)

// Track 3: Card 03 — The Zig-Zag Waver
const tl3 = useAnimeTimeline({ autoplay: false })
tl3
  .add('.card-3 .story-box', {
    x: [0, -22, 22, -12, 12, 0],
    duration: 900,
    ease: easeSmooth,
  })
  .add('.card-3 .story-box', {
    rotate: [0, -24, 24, -12, 12, 0],
    scale: [1, 1.12, 0.95, 1.05, 1],
    duration: 900,
    ease: easeSmooth,
  }, 0)

// Track 4: Card 04 — The Morph Pulsar
const tl4 = useAnimeTimeline({ autoplay: false })
tl4.add('.card-4 .story-box', {
  scale: [1, 1.32, 0.88, 1.15, 1],
  rotate: [0, 45, 90, 45, 0],
  duration: 950,
  ease: easePop,
})

// Track 5: Grand Finale — Synchronized Wave Ripple
const tlFinale = useAnimeTimeline({ autoplay: false })
tlFinale
  .add('.story-box', {
    y: [0, -20, 0],
    delay: stagger(90),
    duration: 600,
    ease: easeSmooth,
  })
  .add('.story-box', {
    scale: [1, 1.1, 1],
    delay: stagger(90),
    duration: 600,
    ease: easeSmooth,
  }, 0)

// Master Timeline orchestrating all cards into one composition
const tlMaster = useAnimeTimeline({
  autoplay: false,
  onUpdate: (self) => {
    progress.value = self.progress
  },
  onBegin: () => {
    isPlaying.value = true
  },
  onPause: () => {
    isPlaying.value = false
  },
  onComplete: () => {
    isPlaying.value = false
  },
})

tlMaster
  .sync(tl1, 0)
  .sync(tl2, 350)
  .sync(tl3, 850)
  .sync(tl4, 1450)
  .sync(tlFinale, 2300)

function seek(value: number) {
  progress.value = value
  tlMaster.pause()
  isPlaying.value = false
  tlMaster.seek(value * (tlMaster.duration || 3200))
}

const actions: ExampleAction[] = [
  {
    label: 'Play',
    run: () => {
      if (progress.value >= 1) {
        tlMaster.restart()
      }
      else {
        tlMaster.play()
      }
    },
  },
  {
    label: 'Pause',
    run: () => tlMaster.pause(),
  },
  {
    label: 'Restart',
    run: () => tlMaster.restart(),
  },
]

const slider = computed(() => ({
  value: progress.value,
  onInput: seek,
}))

const status = computed(() => `${isPlaying.value ? 'playing' : 'paused'} · ${Math.round(progress.value * 100)}%`)
</script>

<template>
  <ExampleWrapper
    :actions="actions"
    :slider="slider"
    :status="status"
  >
    <div class="relative w-full h-56 sm:h-64 rounded-lg bg-primary/5 border border-primary/20 flex items-center justify-center gap-4 sm:gap-6 overflow-hidden select-none p-6">
      <!-- 4 Station Slots with Unique Card Classes -->
      <div
        v-for="i in 4"
        :key="i"
        :class="`card-${i}`"
        class="relative size-14 sm:size-16 flex items-center justify-center"
      >
        <!-- Floor slot base with shaded grid pattern -->
        <div class="spot-station absolute inset-0 size-full rounded-xl" />

        <!-- Position + rotation + scale all animate on this one element -->
        <div class="story-box">
          0{{ i }}
        </div>
      </div>
    </div>
  </ExampleWrapper>
</template>

<style scoped>
@reference "~/assets/css/main.css";

.spot-station {
  @apply border border-dashed border-primary/35 rounded-xl;
  background-image: repeating-linear-gradient(
    45deg,
    color-mix(in hsl, var(--color-primary), transparent 80%) 0,
    color-mix(in hsl, var(--color-primary), transparent 80%) 1px,
    transparent 1px,
    transparent 6px
  );
}

.story-box {
  @apply absolute inset-0 z-10 size-full select-none rounded-xl bg-primary;
  @apply grid place-items-center font-mono text-sm font-bold text-black shadow-md;
}
</style>
