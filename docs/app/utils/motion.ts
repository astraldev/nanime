import { cubicBezier } from '#nanime/easings'

/** Motion tokens for docs chrome. Demos keep literal values so they stay copy-pasteable. */

/** Anime v4 removed the `'cubicBezier(...)'` string form — it degrades to linear. */
export const motionEase = cubicBezier(0.4, 0, 0.2, 1)

export const motionDuration = {
  quick: 350,
  standard: 500,
  slow: 800,
  ambient: 2400,
} as const

/** Last element must start under 500ms. */
export const motionStagger = {
  micro: 35,
  standard: 70,
  dramatic: 140,
} as const

/** Entrance: rise this far while fading in. */
export const motionRise = 12
