<script setup lang="ts">
import { tryOnScopeDispose } from '@vueuse/core'
import ExampleWrapper, { type ExampleAction } from '~/components/shared/ExampleWrapper.vue'

const DEFAULT_DELAY = 500 // fallback pause after text has fully scrambled

interface SequenceStep {
  text: string
  delay?: number // custom pause mimicking work time
}

const steps: SequenceStep[] = [
  { text: 'Initializing build context...', delay: 400 },
  { text: 'Resolving module graph...', delay: 800 },
  { text: 'Scanning plugins & hooks...', delay: 500 },
  { text: 'Transforming Vue SFC templates...', delay: 1200 },
  { text: 'Compiling TypeScript definitions...', delay: 1500 },
  { text: 'Tree-shaking unused exports...', delay: 600 },
  { text: 'Bundling client & server chunks...', delay: 2000 },
  { text: 'Optimizing CSS & assets...', delay: 1000 },
  { text: 'Generating route manifests...', delay: 400 },
  { text: 'Emitting production build...', delay: 1200 },
]

const state = ref<'idle' | 'loading' | 'success'>('idle')
const isPaused = ref(false)
const currentStepIndex = ref(-1)
const currentText = ref('Ready to build')

const spinner = useTemplateRef('spinner')
const successMark = useTemplateRef('successMark')
const statusEl = useTemplateRef('statusEl')

const spinnerAnimation = useWaapiAnimate(spinner, {
  rotate: { to: 360 },
  duration: 800,
  ease: 'linear',
  loop: true,
})

useAnimate(successMark, {
  opacity: [0, 1],
  scale: [0.8, 1],
  duration: 300,
  ease: 'outQuad',
})

// With revealRate: 50, interval is 1000/50 = 20ms per character
const getScrambleDuration = (text: string) => Math.max(0, text.length - 1) * 20 + 300

const scrambleConfig = computed(() => ({
  text: currentText.value,
  chars: '0123456789abcdef',
  settleDuration: 300,
  revealRate: 50,
}))

useScrambleText(statusEl, {}, scrambleConfig)

let timer: ReturnType<typeof setTimeout> | undefined

function advanceStep() {
  currentStepIndex.value++

  if (currentStepIndex.value < steps.length) {
    const current = steps[currentStepIndex.value]!
    currentText.value = `[${currentStepIndex.value + 1}/${steps.length}] ${current.text}`

    const duration = getScrambleDuration(currentText.value)
    const stepDelay = current.delay ?? DEFAULT_DELAY
    // Wait for full sentence scramble + step delay before next step
    timer = setTimeout(advanceStep, duration + stepDelay)
  }
  else {
    state.value = 'success'
    currentText.value = `Built in 11.5s (${steps.length} steps)`
  }
}

function runSequence() {
  if (state.value === 'success') {
    reset()
    return
  }

  if (state.value !== 'idle') return

  state.value = 'loading'
  isPaused.value = false
  advanceStep()
}

function togglePause() {
  if (state.value !== 'loading') return
  isPaused.value = !isPaused.value

  if (isPaused.value) {
    clearTimeout(timer)
    spinnerAnimation?.pause()
  }
  else {
    spinnerAnimation?.play()
    const current = steps[currentStepIndex.value]
    const duration = getScrambleDuration(currentText.value)
    const stepDelay = current?.delay ?? DEFAULT_DELAY
    timer = setTimeout(advanceStep, duration + stepDelay)
  }
}

function reset() {
  clearTimeout(timer)
  state.value = 'idle'
  isPaused.value = false
  currentStepIndex.value = -1
  currentText.value = 'Ready to build'
  spinnerAnimation?.play()
}

tryOnScopeDispose(() => {
  clearTimeout(timer)
})

const actions = computed<ExampleAction[]>(() => {
  if (state.value === 'idle') {
    return [
      {
        label: 'Run Build',
        run: runSequence,
      },
    ]
  }

  if (state.value === 'loading') {
    return [
      {
        label: isPaused.value ? 'Resume' : 'Pause',
        run: togglePause,
        active: isPaused.value,
      },
      {
        label: `[${currentStepIndex.value + 1}/${steps.length}]`,
        run: () => {},
        active: true,
      },
      {
        label: 'Reset',
        run: reset,
      },
    ]
  }

  return [
    {
      label: 'Reset',
      run: reset,
    },
    {
      label: 'Re-run',
      run: runSequence,
    },
  ]
})
</script>

<template>
  <ExampleWrapper :actions="actions">
    <div class="w-full font-mono text-xs sm:text-sm space-y-1.5 py-1 select-none">
      <div class="text-muted flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="text-primary font-bold">$</span>
          <span>nanime build</span>
        </div>
        <span
          v-if="isPaused"
          class="text-[10px] text-amber-500 font-bold uppercase tracking-wider"
        >
          [paused]
        </span>
      </div>

      <div class="flex items-center gap-2 text-highlighted">
        <span
          v-if="state === 'idle'"
          class="text-muted w-4 shrink-0 font-bold"
        >
          &gt;
        </span>

        <span
          v-if="state === 'loading'"
          ref="spinner"
          class="w-4 h-4 shrink-0 flex items-center justify-center text-primary"
        >
          <UIcon
            name="i-ph-spinner-gap"
            class="size-4"
          />
        </span>

        <span
          v-if="state === 'success'"
          ref="successMark"
          class="w-4 shrink-0 text-primary font-bold"
        >
          ✔
        </span>

        <span
          ref="statusEl"
          class="truncate"
        >
          Ready to build
        </span>
      </div>
    </div>
  </ExampleWrapper>
</template>
