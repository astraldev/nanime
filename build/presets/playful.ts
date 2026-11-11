import { spring } from 'animejs/easings'
import { defineAnimationPreset } from '../../src/runtime/app/utils/presets'
import { presetStyles } from './lib/styles'

/**
 * @name
 * playful
 *
 * @description
 * Bouncy, poppy motion with a little overshoot. Prefer this for fun side projects.
 *
 * @timing (0.15 - 0.95s)
 * Quick to start, slow to settle, with a visible overshoot on the way in.
 * Entrances and moves have no fixed length, because a spring sets its
 * own. Fades and exits are short and never bounce.
 *
 * @vocabulary
 * Springs: one that overshoots about 10% for entrances and a softer one
 * (about 1.5%) for moves and layout changes. A spring sets its own
 * length, so `duration` is ignored wherever one is the ease. More travel
 * than formal (20px) and a visible pop on scale (0.85). Releasing a
 * dragged element overshoots slightly.
 *
 * @bestFor
 * Consumer apps, onboarding, empty states, gamified UI, kids' products,
 * marketing pages.
 *
 * @avoidFor
 * Dashboards, finance, medical software and anything official.
 */

/** Lively spring with a visible overshoot, for entrances. */
export const pop = spring({ bounce: 0.4, duration: 350 })
/** Softer spring for moves and layout changes. */
export const bounce = spring({ bounce: 0.2, duration: 450 })

export default defineAnimationPreset({
  shared: presetStyles({
    enterEase: pop,
    leaveEase: 'in(3)',
    moveEase: bounce,
    fadeEnterEase: 'out(3)',
    fadeEnterDuration: 200,
    fadeLeaveDuration: 150,
    leaveDuration: 180,
    distance: 20,
    scale: 0.85,
  }),

  components: {
    transition: { animation: 'fade' },
    transitionGroup: { animation: 'list' },
    layoutGroup: { layoutOptions: { ease: bounce } },
  },

  composables: {
    animate: { duration: 400, ease: 'outBack(1.2)' },
    draggable: { releaseMass: 1, releaseStiffness: 200, releaseDamping: 28, releaseEase: 'outBack(1.4)' },
  },
})
