import { cubicBezier } from 'animejs/easings'
import { defineAnimationPreset } from '../../src/runtime/app/utils/presets'
import { presetStyles } from './lib/styles'

/**
 * @name
 * formal
 *
 * @description
 * Calm, precise motion. Things fade and slide into place with no
 * overshoot. Prefer this for professional tools and official products.
 *
 * @timing (0.07 - 0.24s)
 * Fast and even, start to finish. No overshoot. Fades take 70 to 110ms,
 * short movements 110 to 150ms, and moves and layout changes 240ms.
 *
 * @vocabulary
 * Productive easing from the IBM Carbon motion system: a decelerating
 * entrance, an accelerating exit and a standard curve for moves. Short
 * slides (8px) and a slight scale (0.96). Durations follow Carbon's token
 * steps (70, 110, 150, 240).
 *
 * @bestFor
 * Dashboards, finance, admin panels, medical and legal software,
 * documentation, enterprise apps.
 *
 * @avoidFor
 * Kids' products, gamified UI, marketing pages and anything meant to
 * feel playful or alive.
 */

/** Carbon productive standard curve, for things that move on screen. */
export const standard = cubicBezier(0.2, 0, 0.38, 0.9)
/** Carbon productive entrance curve: starts fast and settles. */
export const entrance = cubicBezier(0, 0, 0.38, 0.9)
/** Carbon productive exit curve: starts slow and leaves quickly. */
export const exit = cubicBezier(0.2, 0, 1, 0.9)

export default defineAnimationPreset({
  shared: presetStyles({
    enterEase: entrance,
    leaveEase: exit,
    moveEase: standard,
    fadeEnterDuration: 110,
    fadeLeaveDuration: 70,
    enterDuration: 150,
    leaveDuration: 110,
    moveDuration: 240,
    distance: 8,
    scale: 0.96,
  }),

  components: {
    transition: { animation: 'fade' },
    transitionGroup: { animation: 'list' },
    layoutGroup: { layoutOptions: { duration: 240, ease: standard } },
  },

  composables: {
    animate: { duration: 240, ease: standard },
    draggable: { releaseMass: 1, releaseStiffness: 300, releaseDamping: 34, releaseEase: 'outQuint' },
  },
})
