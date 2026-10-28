import { defineAnimationPreset } from '../../src/runtime/app/utils/presets'

/**
 * @name
 * playful
 *
 * @description
 * Bouncy, poppy motion with a little overshoot. Prefer this for fun side projects
 *
 * @timing (0.3 - 1.5s)
 * Quick to start, slow to settle, with overshoots.
 *
 * @vocabulary
 * (to be filled in)
 *
 * @bestFor
 * Consumer apps, onboarding, empty states, gamified UI, kids' products,
 * marketing pages.
 *
 * @avoidFor
 * Dashboards, finance, medical — Prefer not using it for anything official
 */
export default defineAnimationPreset({
  shared: {},

  components: {
    transition: {},
    transitionGroup: {},
    layout: {},
  },

  composables: {
    animate: {},
    draggable: {},
  },
})
