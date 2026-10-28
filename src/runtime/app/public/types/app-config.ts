import type { AnimationParams, DraggableParams } from 'animejs'
import type { AnimeTransitionStyle } from './transitions'
import type { NanimeComponentDefaults } from './components'
import type { NanimeReducedMotion } from './options'

/** Default `useDraggable()` options. `trigger` and `container` belong to one element, so they are not defaults. */
export type DraggableDefaults = Omit<DraggableParams, 'trigger' | 'container'>

/** Default parameters for nanime composables, from `app.config.ts` or `provideAnimeDefaults()`. */
export interface NanimeComposableDefaults {
  /** Default parameters for `useAnimate()`. The parameters passed to the call win, prop by prop. */
  animate?: AnimationParams
  /** Default options for `useDraggable()`. The options passed to the call win, option by option. */
  draggable?: DraggableDefaults
}

/** What `provideAnimeDefaults()` accepts: component defaults plus a `composables` entry. */
export interface NanimeDefaults extends NanimeComponentDefaults {
  /** Default parameters for each composable. */
  composables?: NanimeComposableDefaults
}

/** The `nanime` key in `app.config.ts`. */
export interface NanimeAppConfig {
  /** Overrides `reducedMotion` from `nuxt.config.ts`, and can change at runtime. */
  reducedMotion?: NanimeReducedMotion
  /** Named transition styles. A name shared with a built-in replaces it. */
  transitions?: Record<string, AnimeTransitionStyle>
  /** Default props for each component. A prop passed to the component wins. */
  components?: NanimeComponentDefaults
  /** Default parameters for each composable. Parameters passed to the call win. */
  composables?: NanimeComposableDefaults
}
