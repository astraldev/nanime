/** Duration types */
export type DurationOutput = {
  enter: number
  leave: number
}

export type TransitionDurationInput
  = | number
    | [number, number]
    | { enter: number, leave: number }

/** Axis types */

type Axis = 'x' | 'y'
export type AxisInput = Axis | [Axis, Axis] | { enter: Axis, leave: Axis }
export type AxisOutput = { enter: Axis, leave: Axis }

/** Offset types */
type PropertyValue = 'px' | '%'
type OffsetInput = `${number}` | `-${number}` | `${number}${PropertyValue}` | `-${number}${PropertyValue}`
export type OffsetOutput = {
  enter: OffsetInput | number
  leave: OffsetInput | number
}

export type TransitionOffsetInput
  = | OffsetInput
    | number
    | [OffsetInput | number, OffsetInput | number]
    | { enter: OffsetInput | number, leave: OffsetInput | number }
