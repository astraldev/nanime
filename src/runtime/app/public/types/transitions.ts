import type { AnimationParams } from 'animejs'
import type { LayoutAnimationParams } from 'animejs/layout'
import type { AppConfig } from 'nuxt/schema'
import type { builtinTransitionStyles } from '../../transitions/styles'

/** Timing for items that change position in `<AnimeTransitionGroup>`. */
export type AnimeMoveParams = Pick<LayoutAnimationParams, 'duration' | 'delay' | 'ease'>

/** A reusable transition, referenced by name from the animation props. */
export interface AnimeTransitionStyle {
  /** Anime.js params for elements that appear. */
  enter?: AnimationParams
  /** Anime.js params for elements that disappear. */
  leave?: AnimationParams
  /** Timing for items that change position in `<AnimeTransitionGroup>`. */
  move?: AnimeMoveParams
}

type BuiltinTransitionStyleName = keyof typeof builtinTransitionStyles

/** A built-in style name or any other string, for defaults set in `app.config.ts`. */
export type ConfigTransitionStyleName = BuiltinTransitionStyleName | (string & {})

type AppConfigTransitions = NonNullable<NonNullable<AppConfig['nanime']>['transitions']>
type ConfiguredTransitionStyleName = string extends keyof AppConfigTransitions ? never : keyof AppConfigTransitions & string

/**
 * A built-in style (`fade`, `slide-up`, `slide-down`, `slide-left`,
 * `slide-right`, `scale`, `swap`) or one defined in `app.config.ts`.
 */
export type AnimeTransitionStyleName = BuiltinTransitionStyleName | ConfiguredTransitionStyleName | (string & {})
