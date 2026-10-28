import type { AutoLayoutParams } from 'animejs/layout'

/**
 * Availability of `trackTargetsOnly`, set with `experimental.trackTargetsOnly` in the module options.
 * - `off`: the option does not exist.
 * - `opt-in`: a layout uses it when its `trackTargetsOnly` is `true`.
 * - `global`: every layout uses it unless its `trackTargetsOnly` is `false`.
 */
export type NanimeTrackTargetsOnly = 'off' | 'opt-in' | 'global'

/** The option `experimental.trackTargetsOnly` adds to `useAnimeLayout` and `<AnimeLayoutGroup>`. */
export interface TrackTargetsOnlyOptions {
  /**
   * Measure only the `children` targets, their ancestors and the siblings of
   * both, instead of every descendant of the root. Content inside a target
   * reflows instead of animating, and a grid row without a nested target
   * keeps `display: grid` during the animation.
   * @experimental
   * @default false, or true when `experimental.trackTargetsOnly` is `'global'`
   */
  trackTargetsOnly?: boolean
}

declare global {
  /**
   * Options that the experimental features enabled in the nanime module options
   * add to `useAnimeLayout` and `<AnimeLayoutGroup>`. The module fills it in; do not extend it by hand.
   */
  interface NanimeExperimentalLayoutOptions {}
}

/** Params of `useAnimeLayout`: AnimeJS `createLayout()` params plus the enabled experimental options. */
export type AnimeLayoutParams = AutoLayoutParams & NanimeExperimentalLayoutOptions
