import { cubicBezier } from 'animejs/easings'
import { defineAnimationPreset } from '../../src/runtime/app/utils/presets'
import { presetStyles } from './lib/styles'

/**
 * @name
 * elegant
 *
 * @description
 * Smooth, graceful motion. Things glide into place with soft easing and
 * settle gently — no bounce, no snap. Prefer this for refined,
 * high-end products.
 *
 * @timing (0.4 - 0.65s)
 * Slow and flowing, with a long soft tail. Longer than formal, calmer
 * than playful. Exits ease out slowly rather than cutting fast.
 *
 * @vocabulary
 * Expressive easing from the IBM Carbon motion system: a gentle
 * entrance with a long settle and a soft standard curve for exits and
 * moves. Small travel (12px) and a near-still scale (0.98).
 *
 * @bestFor
 * Luxury brands, portfolios, editorial sites, fashion, hospitality,
 * premium apps, product showcases.
 *
 * @avoidFor
 * Fast tools, dashboards, data entry — anything where slow motion
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
    enterDuration: 550,
    leaveDuration: 400,
    moveDuration: 620,
    distance: 12,
    scale: 0.98,
  }),

  components: {
    transition: {},
    transitionGroup: { animation: 'list' },
    layoutGroup: { layoutOptions: { duration: 620, ease: glide } },
  },

  composables: {
    animate: { duration: 550, ease: glide },
    draggable: { releaseStiffness: 60, releaseDamping: 18 },
  },
})
