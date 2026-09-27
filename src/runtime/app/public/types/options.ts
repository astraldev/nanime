/** Options for `useAnimate`, `useAnimeTimeline` and `useScrambleText`. */
export interface NanimeInstanceOptions {
  /**
   * Continue from the current playhead when reactive inputs rebuild the
   * instance, instead of restarting at zero.
   * @default nanime.keepTime in nuxt.config, which defaults to `false`
   */
  keepTime?: boolean
}
