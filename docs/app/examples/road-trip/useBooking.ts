import { computed, onBeforeUnmount, ref } from 'vue'
import { bookingSteps } from './trip'

export type BookingState = 'idle' | 'running' | 'done'

export const readyText = 'Ready to book'
export const scrambleChars = '0123456789ABCDEF'
export const revealRate = 50
export const settleDuration = 300

const logLength = 3

function scrambleDuration(text: string) {
  return Math.max(0, text.length - 1) * (1000 / revealRate) + settleDuration
}

export function useBooking() {
  const state = ref<BookingState>('idle')
  const paused = ref(false)
  const stepIndex = ref(-1)
  const statusText = ref(readyText)
  let timer: ReturnType<typeof setTimeout> | undefined

  const finishedSteps = computed(() =>
    bookingSteps.slice(Math.max(0, stepIndex.value - logLength), Math.max(0, stepIndex.value)))

  function showStep(index: number) {
    stepIndex.value = index
    statusText.value = `[${index + 1}/${bookingSteps.length}] ${bookingSteps[index]?.label}...`
  }

  function finish() {
    stepIndex.value = bookingSteps.length
    state.value = 'done'
    statusText.value = 'Booked · ref RT-4821'
  }

  function scheduleNextStep() {
    clearTimeout(timer)
    const wait = scrambleDuration(statusText.value) + (bookingSteps[stepIndex.value]?.delay ?? 0)
    timer = setTimeout(advance, wait)
  }

  function advance() {
    const next = stepIndex.value + 1
    if (next >= bookingSteps.length) return finish()
    showStep(next)
    scheduleNextStep()
  }

  function book() {
    reset()
    state.value = 'running'
    advance()
  }

  function togglePause() {
    paused.value = !paused.value
    if (paused.value) clearTimeout(timer)
    else scheduleNextStep()
  }

  function reset() {
    clearTimeout(timer)
    state.value = 'idle'
    paused.value = false
    stepIndex.value = -1
    statusText.value = readyText
  }

  onBeforeUnmount(() => clearTimeout(timer))

  return { state, paused, statusText, finishedSteps, book, togglePause, reset }
}
