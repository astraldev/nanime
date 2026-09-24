<script setup lang="ts">
import { spring } from '#nanime/easings'
import ExampleWrapper, { type ExampleAction } from '~/components/shared/ExampleWrapper.vue'

type BuildState = 'idle' | 'running' | 'done'

interface BuildStep {
  label: string
  delay: number
}

const steps: BuildStep[] = [
  { label: 'Resolve module graph', delay: 800 },
  { label: 'Scan plugins and hooks', delay: 500 },
  { label: 'Transform Vue templates', delay: 1200 },
  { label: 'Compile TypeScript', delay: 1500 },
  { label: 'Tree-shake unused exports', delay: 600 },
  { label: 'Bundle client and server', delay: 2000 },
  { label: 'Optimize CSS and assets', delay: 1000 },
  { label: 'Emit production build', delay: 1200 },
]

const logLength = 3
const readyText = 'Ready to build'
const scrambleChars = '0123456789abcdef'
const revealRate = 50
const settleDuration = 300

const iconEnter = {
  opacity: [0, 1],
  scale: [0.4, 1],
  ease: spring({ bounce: 0.5, duration: 400 }),
}

const iconLeave = {
  opacity: 0,
  scale: 0.4,
  duration: 150,
  ease: 'in(2)',
}

const logEnter = {
  opacity: [0, 1],
  y: [10, 0],
  ease: spring({ bounce: 0.2, duration: 400 }),
}

const logLeave = {
  opacity: 0,
  duration: 150,
  ease: 'out(2)',
}

const logMove = {
  ease: spring({ bounce: 0.2, duration: 400 }),
}

const spinParams = {
  rotate: { to: 360 },
  duration: 800,
  ease: 'linear',
  loop: true,
}

const state = ref<BuildState>('idle')
const paused = ref(false)
const stepIndex = ref(-1)
const statusText = ref(readyText)

const spinner = useTemplateRef('spinner')
const statusLine = useTemplateRef('statusLine')

const spin = useWaapiAnimate(spinner, spinParams)

useScrambleText(statusLine, {}, () => ({
  text: statusText.value,
  chars: scrambleChars,
  settleDuration,
  revealRate,
}))

const finishedSteps = computed(() => steps.slice(Math.max(0, stepIndex.value - logLength), Math.max(0, stepIndex.value)))

const status = computed(() => {
  if (state.value === 'done') return 'Build complete'
  const next = steps[stepIndex.value + 1]?.label ?? 'Done'
  if (state.value === 'idle') return `Ready → next: ${next}`
  if (paused.value) return `Paused → next: ${next}`
  return `${stepIndex.value + 1}/${steps.length} → next: ${next}`
})

function scrambleDuration(text: string) {
  return Math.max(0, text.length - 1) * (1000 / revealRate) + settleDuration
}

function currentStepWait() {
  return scrambleDuration(statusText.value) + (steps[stepIndex.value]?.delay ?? 0)
}

function showStep(index: number) {
  stepIndex.value = index
  statusText.value = `[${index + 1}/${steps.length}] ${steps[index]?.label}...`
}

function finish() {
  stepIndex.value = steps.length
  state.value = 'done'
  statusText.value = `Built ${steps.length} steps`
}

function resetState() {
  state.value = 'idle'
  paused.value = false
  stepIndex.value = -1
  statusText.value = readyText
}

let timer: ReturnType<typeof setTimeout> | undefined

function scheduleNextStep() {
  clearTimeout(timer)
  timer = setTimeout(advance, currentStepWait())
}

function advance() {
  const next = stepIndex.value + 1
  if (next >= steps.length) return finish()
  showStep(next)
  scheduleNextStep()
}

function run() {
  resetState()
  state.value = 'running'
  advance()
}

function pause() {
  paused.value = true
  clearTimeout(timer)
  spin.pause()
}

function resume() {
  paused.value = false
  spin.play()
  scheduleNextStep()
}

function togglePause() {
  if (paused.value) resume()
  else pause()
}

function reset() {
  clearTimeout(timer)
  resetState()
}

onBeforeUnmount(() => clearTimeout(timer))

const actions = computed<ExampleAction[]>(() => {
  if (state.value === 'running') {
    return [
      { label: paused.value ? 'Resume' : 'Pause', run: togglePause, active: paused.value },
      { label: 'Reset', run: reset },
    ]
  }
  if (state.value === 'done') {
    return [
      { label: 'Run again', run },
      { label: 'Reset', run: reset },
    ]
  }
  return [{ label: 'Run build', run }]
})
</script>

<template>
  <ExampleWrapper
    :actions="actions"
    :status="status"
  >
    <div class="flex h-36 w-full flex-col font-mono text-xs select-none sm:text-sm">
      <div class="flex items-center justify-between text-muted">
        <div class="flex items-center gap-2">
          <span class="font-bold text-primary">$</span>
          <span>nanime build</span>
        </div>
        <AnimeTransition>
          <span
            v-if="paused"
            class="text-[10px] font-bold tracking-wider text-primary uppercase"
          >
            [paused]
          </span>
        </AnimeTransition>
      </div>

      <AnimeTransitionGroup
        tag="ul"
        class="relative mt-auto flex flex-col gap-1.5"
        :enter-animation="logEnter"
        :leave-animation="logLeave"
        :move-animation="logMove"
      >
        <li
          v-for="step in finishedSteps"
          :key="step.label"
          class="flex items-center gap-2 text-muted"
        >
          <UIcon
            name="i-ph-check-bold"
            class="size-4 shrink-0 text-primary"
          />
          <span class="truncate">{{ step.label }}</span>
        </li>
      </AnimeTransitionGroup>

      <div class="mt-1.5 flex items-center gap-2 text-highlighted">
        <div class="grid size-4 shrink-0 place-items-center">
          <AnimeTransition
            mode="out-in"
            :enter-animation="iconEnter"
            :leave-animation="iconLeave"
          >
            <span
              v-if="state === 'running'"
              class="flex text-primary"
            >
              <span
                ref="spinner"
                class="flex"
              >
                <UIcon
                  name="i-ph-spinner-gap"
                  class="size-4"
                />
              </span>
            </span>
            <span
              v-else-if="state === 'done'"
              class="flex text-primary"
            >
              <UIcon
                name="i-ph-check-circle-fill"
                class="size-4"
              />
            </span>
            <span
              v-else
              class="flex text-muted"
            >
              <UIcon
                name="i-ph-caret-right-bold"
                class="size-4"
              />
            </span>
          </AnimeTransition>
        </div>

        <span
          ref="statusLine"
          class="truncate"
        >
          {{ readyText }}
        </span>
      </div>
    </div>
  </ExampleWrapper>
</template>
