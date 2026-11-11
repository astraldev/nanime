import type { EasingParam } from 'animejs'
import type { AnimeTransitionStyle } from '../../../src/runtime/app/public/types'

export interface PresetMotion {
  enterEase: EasingParam
  leaveEase: EasingParam
  moveEase: EasingParam
  fadeEnterEase?: EasingParam
  fadeLeaveEase?: EasingParam
  enterDuration?: number
  leaveDuration?: number
  moveDuration?: number
  fadeEnterDuration: number
  fadeLeaveDuration: number
  distance: number
  scale: number
}

interface Timing {
  ease: EasingParam
  duration?: number
}

export function presetStyles(motion: PresetMotion) {
  const timing = (ease: EasingParam, duration?: number): Timing => duration === undefined ? { ease } : { duration, ease }

  const enter = timing(motion.enterEase, motion.enterDuration)
  const leave = timing(motion.leaveEase, motion.leaveDuration)
  const move = timing(motion.moveEase, motion.moveDuration)
  const fadeEnter = timing(motion.fadeEnterEase ?? motion.enterEase, motion.fadeEnterDuration)
  const fadeLeave = timing(motion.fadeLeaveEase ?? motion.leaveEase, motion.fadeLeaveDuration)

  const slide = (axis: 'x' | 'y', distance: number) => ({
    enter: { opacity: [0, 1], [axis]: [distance, 0], ...enter },
    leave: { opacity: 0, [axis]: -distance, ...leave },
    move,
  }) satisfies AnimeTransitionStyle

  return {
    'fade': {
      enter: { opacity: [0, 1], ...fadeEnter },
      leave: { opacity: 0, ...fadeLeave },
      move,
    },
    'slide-up': slide('y', motion.distance),
    'slide-down': slide('y', -motion.distance),
    'slide-left': slide('x', motion.distance),
    'slide-right': slide('x', -motion.distance),
    'scale': {
      enter: { opacity: [0, 1], scale: [motion.scale, 1], ...enter },
      leave: { opacity: 0, scale: motion.scale, ...leave },
      move,
    },
    'swap': {
      enter: { opacity: [0, 1], y: [motion.distance / 2, 0], ...enter },
      leave: { opacity: 0, y: -motion.distance / 2, ...leave },
      move,
    },
    'list': {
      enter: { opacity: [0, 1], y: [motion.distance / 2, 0], ...enter },
      leave: { opacity: 0, ...leave },
      move,
    },
  } satisfies Record<string, AnimeTransitionStyle>
}
