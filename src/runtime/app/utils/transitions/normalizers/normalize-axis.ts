import type { AxisInput, AxisOutput } from '../types'

export function normalizeAxis(axis?: AxisInput): AxisOutput {
  if (axis === undefined) {
    return { enter: 'y', leave: 'y' }
  }

  if (typeof axis === 'string') {
    return { enter: axis, leave: axis }
  }

  if (Array.isArray(axis)) {
    return { enter: axis[0], leave: axis[1] }
  }

  return axis
}
