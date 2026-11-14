/**
 * An absolute time in milliseconds, a point name, a point with a shift
 * (`'open+150'`, `'open-20%'`), or a `<±X` shift from the previous tween's
 * start. Shifts accept `ms`, `s`, or `%`.
 */
export type WaapiTimelinePosition = number | string

/**
 * A single keyframe value accepted by the Web Animations API.
 */
export type WaapiTimelineValue = string | number

/**
 * The start and end value of one property, as `[from, to]`.
 *
 * Both values must be the same type: `[0, 1]` or `['0px', '12px']`.
 */
export type WaapiTimelinePair = readonly [string, string] | readonly [number, number]

/**
 * Three or more values of one property, as evenly spaced keyframes:
 * `[0, 1, 0.5]` or `['0px', '80px', '40px']`.
 *
 * All values must be the same type. The tween's `ease` shapes the progress of
 * the whole tween, not each segment. Keyframe offsets and per-keyframe easing
 * are not supported.
 */
export type WaapiTimelineStops = readonly string[] | readonly number[]

/**
 * A tween value with an optional start and end.
 *
 * `{ to }` animates from the element's current value. `{ from }` animates
 * to the element's current value.
 */
export interface WaapiTimelineRange {
  /** @default the element's current value */
  from?: WaapiTimelineValue
  /** @default the element's current value */
  to?: WaapiTimelineValue
}

/**
 * Any value accepted for one CSS property in a tween: a single value, a
 * `[from, to]` pair, a `{ from, to }` object, or an array of stops.
 */
export type WaapiTimelineFrame = WaapiTimelineValue | WaapiTimelinePair | WaapiTimelineStops | WaapiTimelineRange

/**
 * A DOM target for `createWaapiTimeline()`.
 */
export type WaapiTimelineDomTarget = Element | Element[] | NodeListOf<Element> | string | null | undefined

/**
 * A DOM target, or a function that returns one when the timeline builds.
 */
export type WaapiTimelineTarget = WaapiTimelineDomTarget | (() => WaapiTimelineDomTarget)

/**
 * Parameters for one tween.
 *
 * `at`, `duration`, `delay` and `ease` are reserved. Every other key is a CSS
 * property with a `[from, to]` pair, a `{ from, to }` object, or a single
 * value, or an array of three or more stops, passed to WAAPI as-is.
 */
export interface WaapiTimelineEasePair {
  /** The easing used while the timeline plays forward. */
  forward: string
  /** The easing used while it plays backward. Defaults to `forward`. */
  reverse?: string
}

export type WaapiTimelineEase = string | WaapiTimelineEasePair

export type WaapiTweenParams = {
  /**
   * When the tween starts: absolute milliseconds, a point name, or a
   * `<±X` shift from the previous tween's start (`ms`, `s`, or `%` of its
   * duration).
   * @default the end of the previous tween, or 0 for the first tween
   */
  at?: WaapiTimelinePosition
  /** @default 300 */
  duration?: number
  /** @default 0 */
  delay?: number
  /**
   * A single easing for both directions, or `{ forward, reverse }` to pick
   * the easing applied while the timeline plays backward. `reverse` defaults
   * to `forward`; it is not derived.
   * @default 'linear'
   */
  ease?: WaapiTimelineEase
} & Record<string, WaapiTimelineFrame | WaapiTimelinePosition | WaapiTimelineEase | undefined>

/**
 * A function to run when the playhead crosses `at`.
 */
export interface WaapiTimelineCallback {
  /** Runs once each time the playhead crosses `at`. */
  fn: () => void
  /** @default 0 */
  at?: WaapiTimelinePosition
}

/**
 * A callback function, or an object with `fn` and `at`.
 */
export type WaapiTimelineCallbackInput = (() => void) | WaapiTimelineCallback

/**
 * Defaults applied to every tween that does not set its own.
 */
export interface WaapiTimelineDefaults {
  /** @default 300 */
  duration?: number
  /** @default 'linear' */
  ease?: WaapiTimelineEase
}

/**
 * How `fill` is chosen for each property animation.
 *
 * `'auto'` applies the coverage rule: the first tween on a property fills
 * both, later tweens fill forwards.
 */
export type WaapiTimelineFill = 'auto' | 'none' | 'forwards' | 'both'

/**
 * Options for `createWaapiTimeline()` and `useWaapiTimeline()`.
 */
export interface WaapiTimelineOptions {
  /** Default duration and easing for every tween. */
  defaults?: WaapiTimelineDefaults
  /**
   * Play when the timeline is created.
   * @default false
   */
  autoplay?: boolean
  /**
   * Fill mode for every property animation. `'auto'` uses the coverage rule.
   * @default 'auto'
   */
  fill?: WaapiTimelineFill
  /**
   * Return `true` to make `play()` and `reverse()` jump to the destination.
   * @default () => false
   */
  isReducedMotion?: () => boolean
  /**
   * Called when `isRunning` changes.
   */
  onRunningChange?: (running: boolean) => void
}

export interface WaapiTimelineMembers<Self, Running, Target> {
  /**
   * True while the timeline is playing, in either direction.
   */
  readonly isRunning: Running
  /**
   * The length of the timeline in milliseconds.
   */
  readonly duration: number
  /**
   * The current playhead in milliseconds, or `0` before the first build.
   */
  readonly currentTime: number
  /**
   * The current playhead as a fraction between `0` and `1`.
   */
  readonly progress: number
  /**
   * True after `pause()` and before the next `play()`/`reverse()`.
   */
  readonly paused: boolean
  /**
   * True when the timeline reached an end and stopped.
   */
  readonly completed: boolean

  /**
   * Register a named time that `tween()` can use in `at`, optionally with a
   * `+`/`-` shift such as `'open-20%'`.
   */
  point(name: string, at: WaapiTimelinePosition): Self
  /**
   * Add a tween. Without `at` it starts when the previous tween ends.
   */
  tween(target: Target, params: WaapiTweenParams): Self
  /**
   * Run `fn` when the playhead crosses `at`, in either direction.
   */
  callback(input: WaapiTimelineCallbackInput, at?: WaapiTimelinePosition): Self

  /**
   * Play forward. Replays from `0` after the timeline finished.
   */
  play(): Self
  /**
   * Play backward. Replays from the end after the timeline finished.
   */
  reverse(): Self
  /**
   * Continue in the current direction after `pause()`.
   */
  resume(): Self
  /**
   * Pause the clock and every tween.
   */
  pause(): Self
  /**
   * Seek to `0` and play forward.
   */
  restart(): Self
  /**
   * Play in the opposite direction.
   */
  alternate(): Self
  /**
   * Move the playhead to `time` in milliseconds.
   */
  seek(time: number): Self
  /**
   * Stop and release the current animations. The next play rebuilds from the
   * registered tweens.
   */
  cancel(): Self
}

/**
 * A native Web Animations timeline from `createWaapiTimeline()`.
 *
 * `isRunning` is a boolean. `WaapiTimelineRef` is the Vue version.
 */
export type WaapiTimeline = WaapiTimelineMembers<WaapiTimeline, boolean, WaapiTimelineTarget>
