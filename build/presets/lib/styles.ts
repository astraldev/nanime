import type { EasingParam } from 'animejs'
import type { AnimeTransitionStyle } from '../../../src/runtime/app/public/types'

export interface PresetMotion {
  enterEase: EasingParam
  leaveEase: EasingParam
  moveEase: EasingParam
  enterDuration: number
  leaveDuration: number
  moveDuration: number
  distance: number
  scale: number
}

export function presetStyles(motion: PresetMotion) {
  const enter = { duration: motion.enterDuration, ease: motion.enterEase }
  const leave = { duration: motion.leaveDuration, ease: motion.leaveEase }

  const slide = (axis: 'x' | 'y', distance: number) => ({
    enter: { opacity: [0, 1], [axis]: [distance, 0], ...enter },
    leave: { opacity: 0, [axis]: -distance, ...leave },
  }) satisfies AnimeTransitionStyle

  return {
    'fade': {
      enter: { opacity: [0, 1], ...enter },
      leave: { opacity: 0, ...leave },
    },
    'slide-up': slide('y', motion.distance),
    'slide-down': slide('y', -motion.distance),
    'slide-left': slide('x', motion.distance),
    'slide-right': slide('x', -motion.distance),
    'scale': {
      enter: { opacity: [0, 1], scale: [motion.scale, 1], ...enter },
      leave: { opacity: 0, scale: motion.scale, ...leave },
    },
    'swap': {
      enter: { opacity: [0, 1], y: [motion.distance / 2, 0], ...enter },
      leave: { opacity: 0, y: -motion.distance / 2, ...leave },
    },
    'list': {
      enter: { opacity: [0, 1], y: [motion.distance / 2, 0], ...enter },
      leave: { opacity: 0, ...leave },
      move: { duration: motion.moveDuration, ease: motion.moveEase },
    },
  } satisfies Record<string, AnimeTransitionStyle>
}
