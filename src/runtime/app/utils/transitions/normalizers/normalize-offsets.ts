import type { OffsetOutput, TransitionOffsetInput } from '../types'

function validateOffsetValue(value: TransitionOffsetInput): void {
  if (typeof value !== 'string') return

  // Allow 'px' or '%' units
  if (value.endsWith('px') || value.endsWith('%')) return

  // Allow plain number strings
  if (/^-?\d+$/.test(value)) return

  throw new Error(`Invalid offset value: "${value}". Offset strings must end with "px" or "%", or be a plain number.`)
}

export function normalizeOffset(offset?: TransitionOffsetInput): OffsetOutput {
  if (offset === undefined) {
    return { enter: 0, leave: 0 }
  }

  if (typeof offset === 'number' || typeof offset === 'string') {
    validateOffsetValue(offset)
    return { enter: offset, leave: offset }
  }

  if (Array.isArray(offset)) {
    validateOffsetValue(offset[0])
    validateOffsetValue(offset[1])
    return { enter: offset[0], leave: offset[1] }
  }

  validateOffsetValue(offset.enter)
  validateOffsetValue(offset.leave)
  return offset
}
