import type { AnimationParams, DraggableParams } from 'animejs'
import type { AnimeTransitionStyle } from './transitions'
import type { NanimeComponentDefaults } from './components'
import type { NanimeRebuild, NanimeReducedMotion } from './options'
import type { AnimationPreset } from '../../utils/presets'

/** Default `useDraggable()` options. `trigger` and `container` belong to one element, so they are not defaults. */
export type DraggableDefaults = Omit<DraggableParams, 'trigger' | 'container'>

/** Default parameters for nanime composables, from `app.config.ts` or `provideAnimeDefaults()`. */
export interface NanimeComposableDefaults {
  /** Default parameters for `useAnimate()`. The parameters passed to the call win, prop by prop. */
  animate?: AnimationParams
  /** Default options for `useDraggable()`. The options passed to the call win, option by option. */
  draggable?: DraggableDefaults
}

/** What `provideAnimeDefaults()` accepts: component defaults, a `composables` entry and a `preset`. */
export interface NanimeDefaults extends NanimeComponentDefaults {
  /** Default parameters for each composable. */
  composables?: NanimeComposableDefaults
  /** Preset for everything inside, replacing the one set higher up. A preset sits below `app.config.ts` and the props. */
  preset?: AnimationPreset
  /** Default `rebuild` for the composables inside. A composable's own option wins. */
  rebuild?: NanimeRebuild
}

/** The `nanime` key in `app.config.ts`, which sits over the module options. */
export interface NanimeConfig {
  /** Overrides `rebuild` from `nuxt.config.ts`. A composable's own option and `provideAnimeDefaults()` win. */
  rebuild?: NanimeRebuild
  /** Overrides `reducedMotion` from `nuxt.config.ts`, and can change at runtime. */
  reducedMotion?: NanimeReducedMotion
  /** The preset for the whole app. Import one from `nanime/presets/*` or write your own. Props, `provideAnimeDefaults()` and the rest of this config win over it. */
  preset?: AnimationPreset
  /** Named transition styles. A name shared with a built-in replaces it. */
  transitions?: Record<string, AnimeTransitionStyle>
  /** Default props for each component. A prop passed to the component wins. */
  components?: NanimeComponentDefaults
  /** Default parameters for each composable. Parameters passed to the call win. */
  composables?: NanimeComposableDefaults
}
