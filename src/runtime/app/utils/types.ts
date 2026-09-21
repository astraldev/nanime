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
   * When reactive inputs change, the underlying anime.js instance is rebuilt.
   * `true` carries the playhead over to the replacement, so the animation
   * continues from where it was instead of restarting at zero. Set `false` to
   * restart on every rebuild.
   *
   * Left unset, this follows `nanime.keepTime` in `nuxt.config`, which
   * defaults to `true`.
   */
  keepTime?: boolean
}
