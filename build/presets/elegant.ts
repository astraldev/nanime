import { defineAnimationPreset } from '../../src/runtime/app/utils/presets'

/**
 * @name
 * elegant
 *
 * @description
 * Smooth, graceful motion. Things glide into place with soft easing and
 * settle gently — no bounce, no snap. Prefer this for refined,
 * high-end products.
 *
 * @timing (0.5 - 1.2s)
 * Slow and flowing, with a soft fade at the end. Longer than formal,
 * calmer than playful. Exits ease out slowly rather than cutting fast.
 *
 * @vocabulary
 * (to be filled in)
 *
 * @bestFor
 * Luxury brands, portfolios, editorial sites, fashion, hospitality,
 * premium apps, product showcases.
 *
 * @avoidFor
 * Fast tools, dashboards, data entry — anything where slow motion
 * would feel sluggish or get in the way.
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
