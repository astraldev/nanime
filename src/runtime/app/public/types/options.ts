import type { MaybeRefOrGetter } from 'vue'

/** Options for `useAnimate`, `useAnimeTimeline` and `useScrambleText`. */
export interface NanimeInstanceOptions {
  /**
   * Continue from the current playhead when reactive inputs rebuild the
   * instance, instead of restarting at zero.
   * @default nanime.keepTime in nuxt.config, which defaults to `false`
   */
  keepTime?: boolean
}

/** Options for `useSplitText`. */
export interface SplitTextOptions {
  /**
   * The HTML to split, as a string, ref or getter. When it changes, the new
   * text is split in place. Use it for text that changes, and leave the
   * target element empty in the template
   * @default the target's own content
   */
  html?: MaybeRefOrGetter<string | null | undefined>
}
