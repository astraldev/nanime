import { spring } from 'animejs/easings'
import { defineAnimationPreset } from '../../src/runtime/app/utils/presets'
import { presetStyles } from './lib/styles'

/**
 * @name
 * playful
 *
 * @description
 * Bouncy, poppy motion with a little overshoot. Prefer this for fun side projects
 *
 * @timing (0.2 - 0.9s)
 * Quick to start, slow to settle, with a small overshoot on the way in.
 * Exits are short and never bounce.
 *
 * @vocabulary
 * Springs: one that overshoots about 5% for entrances and a softer one
 * (about 1.5%) for moves and layout changes. A spring sets its own
 * length, so `duration` is ignored wherever one is the ease. More travel
 * than formal (16px) and a visible pop on scale (0.8).
 *
 * @bestFor
 * Consumer apps, onboarding, empty states, gamified UI, kids' products,
 * marketing pages.
 *
 * @avoidFor
 * Dashboards, finance, medical — Prefer not using it for anything official
 */

/** Lively spring with a visible overshoot, for entrances. */
export const pop = spring({ bounce: 0.3, duration: 400 })
/** Softer spring for moves and layout changes. */
export const bounce = spring({ bounce: 0.2, duration: 450 })

export default defineAnimationPreset({
  shared: presetStyles({
    enterEase: pop,
    leaveEase: 'in(3)',
    moveEase: bounce,
    enterDuration: 400,
    leaveDuration: 180,
    moveDuration: 450,
    distance: 16,
    scale: 0.8,
  }),

  components: {
    transition: {},
    transitionGroup: { animation: 'list' },
    layoutGroup: { layoutOptions: { ease: bounce } },
  },

  composables: {
    animate: { ease: bounce },
    draggable: { releaseStiffness: 140, releaseDamping: 14 },
  },
})
