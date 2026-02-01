import type { AutoLayoutParams, EasingParam, LayoutAnimationParams, WAAPIEasingParam } from 'animejs'
import type { VueInstance } from '@vueuse/core'
import type { BaseTransitionProps } from 'vue'
import type { TransitionDurationInput } from '../../utils/transitions/types'

type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

export type SharedTransitionProps = {
  duration?: TransitionDurationInput
  delay?: TransitionDurationInput
  noOpacity?: boolean
  tag?: keyof HTMLElementTagNameMap | HTMLElement | VueInstance
} & (
  | {
    /**
     * Constraint 1 & 2:
     * When group is true, useWaapi MUST be false.
     * Layout/Animate options are available.
     */
    group: true
    useWaapi?: false
    ease?: EasingParam
    layoutOptions?: Prettify<Omit<AutoLayoutParams, 'leaveTo' | 'enterFrom'>>
    animateOptions?: LayoutAnimationParams
    mode?: never
  }
  | {
    /**
     * When group is false/undefined:
     * useWaapi can be a boolean variable.
     * Layout/Animate options are strictly disabled.
     */
    group?: false | undefined
    useWaapi?: boolean
    ease?: WAAPIEasingParam | EasingParam
    mode?: BaseTransitionProps['mode']
    layoutOptions?: never
    animateOptions?: never
  }
)

export const isWaapiEase = (
  properties: SharedTransitionProps,
): properties is SharedTransitionProps & { ease?: WAAPIEasingParam } => {
  return properties.useWaapi === true && !properties.group
}

export const isStandardEase = (
  properties: SharedTransitionProps,
): properties is SharedTransitionProps & { ease?: EasingParam } => {
  return properties.useWaapi === false || properties.group === true
}
