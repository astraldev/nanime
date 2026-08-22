<script setup lang="ts">
import { tryOnScopeDispose } from '@vueuse/core'
import ExampleWrapper, { type ExampleAction } from '~/components/shared/ExampleWrapper.vue'

const SCRAMBLE_DURATION = 600
const STEP_DELAY = 500 // 500ms pause after text has fully scrambled

interface SequenceStep {
  text: string
  scrambleDuration?: number
}

const steps: SequenceStep[] = [
  { text: 'Initializing build context...' },
  { text: 'Resolving module graph...', scrambleDuration: 750 },
  { text: 'Scanning plugins & hooks...' },
  { text: 'Transforming Vue SFC templates...', scrambleDuration: 800 },
  { text: 'Compiling TypeScript definitions...', scrambleDuration: 700 },
  { text: 'Tree-shaking unused exports...' },
  { text: 'Bundling client & server chunks...', scrambleDuration: 800 },
  { text: 'Optimizing CSS & assets...' },
  { text: 'Generating route manifests...' },
  { text: 'Emitting production build...' },
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

const scrambleDuration = computed(() => {
  if (currentStepIndex.value >= 0 && currentStepIndex.value < steps.length) {
    return steps[currentStepIndex.value]?.scrambleDuration ?? SCRAMBLE_DURATION
  }
  return SCRAMBLE_DURATION
})

const scrambleConfig = computed(() => ({
  text: currentText.value,
  chars: '0123456789abcdef',
  settleDuration: 300,
  revealRate: 20,
}))

useScrambleText(statusEl, { duration: () => scrambleDuration.value }, scrambleConfig)

let timer: ReturnType<typeof setTimeout> | undefined

function advanceStep() {
  currentStepIndex.value++

  if (currentStepIndex.value < steps.length) {
    const current = steps[currentStepIndex.value]!
    currentText.value = `[${currentStepIndex.value + 1}/${steps.length}] ${current.text}`

    const duration = current.scrambleDuration ?? SCRAMBLE_DURATION
    // Wait for full sentence scramble + 500ms reading pause before next step
    timer = setTimeout(advanceStep, duration + STEP_DELAY)
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
    const duration = current?.scrambleDuration ?? SCRAMBLE_DURATION
    timer = setTimeout(advanceStep, duration + STEP_DELAY)
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
