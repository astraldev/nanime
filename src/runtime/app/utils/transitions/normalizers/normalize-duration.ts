import type { TransitionDurationInput, DurationOutput } from '../types'

export function normalizeDuration(duration?: TransitionDurationInput): DurationOutput {
  if (duration === undefined) {
    return { enter: 300, leave: 300 }
  }

  if (typeof duration === 'number') {
    return { enter: duration, leave: duration }
  }

  if (Array.isArray(duration)) {
    return { enter: duration[0], leave: duration[1] }
  }

  return duration
}
