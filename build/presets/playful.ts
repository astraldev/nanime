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
 * @timing (0.2 - 1.2s)
 * Quick to start, slow to settle, with overshoots on the way in. Exits
 * are short and never bounce.
 *
 * @vocabulary
 * Springs: a lively one that overshoots about 12% for entrances and a
 * softer one (about 5%) for moves and layout changes. A spring sets its
 * own length, so `duration` is ignored wherever one is the ease. Larger
 * travel (24px) and a real pop on scale (0.6).
 *
 * @bestFor
 * Consumer apps, onboarding, empty states, gamified UI, kids' products,
 * marketing pages.
 *
 * @avoidFor
 * Dashboards, finance, medical — Prefer not using it for anything official
 */

/** Lively spring with a visible overshoot, for entrances. */
export const pop = spring({ bounce: 0.45, duration: 450 })
/** Softer spring for moves and layout changes. */
export const bounce = spring({ bounce: 0.3, duration: 500 })

export default defineAnimationPreset({
  shared: presetStyles({
    enterEase: pop,
    leaveEase: 'in(3)',
    moveEase: bounce,
    enterDuration: 450,
    leaveDuration: 180,
    moveDuration: 500,
    distance: 24,
    scale: 0.6,
  }),

  components: {
    transition: {},
    transitionGroup: { animation: 'list' },
    layoutGroup: { layoutOptions: { ease: bounce } },
  },

  composables: {
    animate: { ease: bounce },
    draggable: { releaseStiffness: 140, releaseDamping: 9 },
  },
})
