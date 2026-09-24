import type { AnimationParams } from 'animejs'
import type { LayoutAnimationParams } from 'animejs/layout'
import type { AppConfig } from 'nuxt/schema'
import type { builtinTransitionStyles } from '../transitions/styles'

export type {
  AnimationParams,
  TargetsParam,
  EasingParam,
  WAAPIEasingParam,
  Draggable,
  DraggableAxisParam,
  DraggableParams,
  WAAPIAnimationParams,
  DOMTargetsParam,
  DOMTargetSelector,
  AnimatableObject,
  AnimatableParams,
  ScrambleTextParams,
  TimelineParams,
  JSAnimation,
  Timer,
  TimerParams,
  TimerOptions,
  DrawableSVGGeometry,
  TextSplitterParams,
  SplitTemplateParams,
  FunctionValue,
  ScrollObserver,
  ScrollObserverParams,
  ScrollObserverAxisCallback,
  ScrollThresholdParam,
  ScrollThresholdValue,
  ScrollThresholdCallback,
} from 'animejs'

export interface NanimeInstanceOptions {
  /**
   * Continue from the current playhead when reactive inputs rebuild the
   * instance, instead of restarting at zero.
   * @default nanime.keepTime in nuxt.config, which defaults to `false`
   */
  keepTime?: boolean
}

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

/** The `nanime` key in `app.config.ts`. */
export interface NanimeAppConfig {
  /** Named transition styles. A name shared with a built-in replaces it. */
  transitions?: Record<string, AnimeTransitionStyle>
}

type BuiltinTransitionStyleName = keyof typeof builtinTransitionStyles

type AppConfigTransitions = NonNullable<NonNullable<AppConfig['nanime']>['transitions']>
type ConfiguredTransitionStyleName = string extends keyof AppConfigTransitions ? never : keyof AppConfigTransitions & string

/**
 * A built-in style (`fade`, `slide-up`, `slide-down`, `slide-left`,
 * `slide-right`, `scale`, `swap`) or one defined in `app.config.ts`.
 */
export type AnimeTransitionStyleName = BuiltinTransitionStyleName | ConfiguredTransitionStyleName | (string & {})
