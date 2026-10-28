import { defineAnimationPreset } from '../../src/runtime/app/utils/presets'

/**
 * @name
 * formal
 *
 * @description
 * Calm, precise motion. Things fade and slide into place with no
 * overshoot. Prefer this for professional tools and official products.
 *
 * @timing (0.15 - 0.5s)
 * Fast and even, start to finish. No overshoot. Exits are slightly
 * quicker than entrances.
 *
 * @vocabulary
 * (to be filled in)
 *
 * @bestFor
 * Dashboards, finance, admin panels, medical and legal software,
 * documentation, enterprise apps.
 *
 * @avoidFor
 * Kids' products, gamified UI, marketing pages — anything meant to
 * feel playful or alive.
 */
export default defineAnimationPreset({
  shared: {},

  components: {
    transition: {},
    transitionGroup: {},
    layoutGroup: {},
  },

  composables: {
    animate: {},
    draggable: {},
  },
})
