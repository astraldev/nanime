import { cubicBezier } from 'animejs/easings'
import { defineAnimationPreset } from '../../src/runtime/app/utils/presets'
import { presetStyles } from './lib/styles'

/**
 * @name
 * elegant
 *
 * @description
 * Smooth, graceful motion. Things glide into place with soft easing and
 * settle gently, with no bounce and no snap. Prefer this for refined,
 * high-end products.
 *
 * @timing (0.24 - 0.5s)
 * Unhurried, with a long soft tail. Fades take 240 to 300ms, entrances
 * 400ms, exits 280ms and moves 500ms. Exits ease out slowly rather
 * than cutting fast.
 *
 * @vocabulary
 * Expressive easing from the IBM Carbon motion system: a gentle
 * entrance with a long settle and a soft standard curve for exits and
 * moves. Small travel (12px) and a near-still scale (0.97).
 *
 * @bestFor
 * Luxury brands, portfolios, editorial sites, fashion, hospitality,
 * premium apps, product showcases.
 *
 * @avoidFor
 * Fast tools, dashboards, data entry and anything where slow motion
 * would feel sluggish or get in the way.
 */

/** Carbon expressive standard curve: a soft start and a long, gentle stop. */
export const glide = cubicBezier(0.4, 0.14, 0.3, 1)
/** Carbon expressive entrance curve: arrives and settles slowly. */
export const settle = cubicBezier(0, 0, 0.3, 1)

export default defineAnimationPreset({
  shared: presetStyles({
    enterEase: settle,
    leaveEase: glide,
    moveEase: glide,
    fadeEnterDuration: 300,
    fadeLeaveDuration: 240,
    enterDuration: 400,
    leaveDuration: 280,
    moveDuration: 500,
    distance: 12,
    scale: 0.97,
  }),

  components: {
    transition: { animation: 'fade' },
    transitionGroup: { animation: 'list' },
    layoutGroup: { layoutOptions: { duration: 500, ease: glide } },
  },

  composables: {
    animate: { duration: 400, ease: settle },
    draggable: { releaseMass: 1, releaseStiffness: 100, releaseDamping: 20, releaseEase: 'outQuint' },
  },
})
