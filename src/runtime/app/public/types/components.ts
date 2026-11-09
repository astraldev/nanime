import type { ComponentPublicInstance } from 'vue'
import type { AnimationParams, Callback, ScrollObserver, WAAPIAnimation, WAAPIAnimationParams, WAAPIEasingParam, WAAPIKeyframeValue, WAAPITweenOptions } from 'animejs'
import type { AutoLayoutParams } from 'animejs/layout'
import type { AnimeMoveParams, AnimeTransitionStyleName, ConfigTransitionStyleName } from './transitions'

/** Order of the leave and enter animations when one element replaces another. */
export type AnimeTransitionMode = 'in-out' | 'out-in' | 'default'

/** A property as `{ from, to, duration, delay, ease }`. */
type WaapiTween = WAAPITweenOptions & ({ to: WAAPIKeyframeValue } | { from: WAAPIKeyframeValue })

/** Options `waapi.animate()` ignores. */
type JsOnlyParam = 'id' | 'keyframes' | 'playbackEase' | 'frameRate' | 'loopDelay' | 'modifier' | 'onBegin' | 'onBeforeUpdate' | 'onUpdate' | 'onLoop' | 'onPause' | 'onRender'

/** `waapi.animate()` params, without `keyframes`, `modifier` or callbacks other than `onComplete`. */
type WaapiTransitionParams = WAAPIAnimationParams
  & AnimationParams
  & Record<string, WAAPIKeyframeValue | WaapiTween | WAAPIEasingParam | boolean | ScrollObserver | Callback<WAAPIAnimation>>
  & { [Key in JsOnlyParam]?: never }

/** `animate()` params, or `waapi.animate()` params when `Waapi` is `true`. A `Waapi` of `boolean` takes none. */
type AnimeTransitionParams<Waapi extends boolean> = [Waapi] extends [true]
  ? WaapiTransitionParams
  : [Waapi] extends [false] ? AnimationParams : never

/**
 * `enter` and `leave` of one transition, each a transition style name or
 * AnimeJS params (`waapi.animate()` params when `Waapi` is `true`).
 */
export interface AnimeTransitionAnimation<StyleName extends string = AnimeTransitionStyleName, Waapi extends boolean = false> {
  /** How the element appears. */
  enter?: StyleName | AnimeTransitionParams<Waapi>
  /** How the element disappears. */
  leave?: StyleName | AnimeTransitionParams<Waapi>
}

/** `enter`, `leave` and `move` of `<AnimeTransitionGroup>`. */
export interface AnimeTransitionGroupAnimation<StyleName extends string = AnimeTransitionStyleName, Waapi extends boolean = false> extends AnimeTransitionAnimation<StyleName, Waapi> {
  /** How items move to a new position: a style name, `{ duration, delay, ease }`, or `false` to skip moves. */
  move?: StyleName | AnimeMoveParams | false
}

/** Props of `<AnimeTransition>`. */
interface TransitionProps<StyleName extends string, Waapi extends boolean> {
  /**
   * Run enter and leave with `waapi.animate()` instead of `animate()`.
   * `animation`, `enterAnimation` and `leaveAnimation` then take
   * `waapi.animate()` params, or style names only when `waapi` is a `boolean`
   * variable. A style `waapi.animate()` can't run falls back to `animate()`.
   * @default false
   */
  waapi?: Waapi
  /**
   * Enter and leave together: a transition style name that supplies both, or
   * `{ enter, leave }`. `enterAnimation` and `leaveAnimation` win for their part.
   */
  animation?: StyleName | AnimeTransitionAnimation<StyleName, Waapi>
  /**
   * How the element appears: a transition style name, or AnimeJS params.
   * @default 'fade'
   */
  enterAnimation?: StyleName | AnimeTransitionParams<Waapi>
  /**
   * How the element disappears: a transition style name, or AnimeJS params.
   * @default 'fade'
   */
  leaveAnimation?: StyleName | AnimeTransitionParams<Waapi>
  /**
   * Order when one element replaces another. `out-in` waits for the old one to
   * leave before the new one enters.
   * @default 'default'
   */
  mode?: AnimeTransitionMode
  /**
   * Run the enter animation on the first render too.
   * @default false
   */
  appear?: boolean
  /**
   * Jump running animations to their end when the browser tab is hidden.
   * AnimeJS pauses every animation while the tab is hidden, which otherwise
   * leaves elements mid-way until the tab is visible again.
   * @default false
   */
  completeOnTabHidden?: boolean
}

/** Props of `<AnimeTransition>`. */
export type AnimeTransitionProps<StyleName extends string = AnimeTransitionStyleName>
  = | TransitionProps<StyleName, false>
    | (TransitionProps<StyleName, true> & { waapi: true })
    | TransitionProps<StyleName, boolean>

/** Props of `<AnimeTransitionGroup>`. */
interface TransitionGroupProps<StyleName extends string, Waapi extends boolean> {
  /**
   * Element rendered around the items.
   * @default 'div'
   */
  tag?: string
  /**
   * Run enter and leave with `waapi.animate()` instead of `animate()`. Moves
   * still use AnimeJS layout animations. `animation`, `enterAnimation` and
   * `leaveAnimation` then take `waapi.animate()` params, or style names only
   * when `waapi` is a `boolean` variable. A style `waapi.animate()` can't run
   * falls back to `animate()`.
   * @default false
   */
  waapi?: Waapi
  /**
   * Enter, leave and move together: a transition style name that supplies all
   * three, or `{ enter, leave, move }`. `enterAnimation`, `leaveAnimation` and
   * `moveAnimation` win for their part.
   */
  animation?: StyleName | AnimeTransitionGroupAnimation<StyleName, Waapi>
  /**
   * How items appear: a transition style name, or AnimeJS params.
   * @default a fade in over 250ms, `out(3)`
   */
  enterAnimation?: StyleName | AnimeTransitionParams<Waapi>
  /**
   * How items disappear: a transition style name, or AnimeJS params.
   * @default a fade out over 150ms, `in(3)`
   */
  leaveAnimation?: StyleName | AnimeTransitionParams<Waapi>
  /**
   * How items move to a new position: a transition style name,
   * `{ duration, delay, ease }`, or `false` to skip moves.
   * @default { duration: 350, ease: 'out(3)' }
   */
  moveAnimation?: StyleName | AnimeMoveParams | false
  /**
   * Run the enter animation on the first render too.
   * @default false
   */
  appear?: boolean
  /**
   * Take leaving items out of the flow as soon as they start leaving, so the
   * rest close the gap while they animate out.
   * @default true
   */
  absoluteLeave?: boolean
  /**
   * Values that trigger a move animation when they change, including changes
   * nested inside them. Adding, removing or reordering items always animates.
   * A function entry is read as a getter, such as `() => state.view`. Without
   * `deps`, every re-render of the group measures and animates moves.
   */
  deps?: readonly unknown[]
  /**
   * Animate only when an entry of `deps` is replaced, not when something
   * nested inside it changes. Read once, when the group is created.
   * @default false
   */
  shallow?: boolean
  /**
   * Jump running animations to their end when the browser tab is hidden.
   * AnimeJS pauses every animation while the tab is hidden, which otherwise
   * leaves elements mid-way until the tab is visible again.
   * @default false
   */
  completeOnTabHidden?: boolean
}

/** Props of `<AnimeTransitionGroup>`. */
export type AnimeTransitionGroupProps<StyleName extends string = AnimeTransitionStyleName>
  = | TransitionGroupProps<StyleName, false>
    | (TransitionGroupProps<StyleName, true> & { waapi: true })
    | TransitionGroupProps<StyleName, boolean>

/** Group props without `deps`. */
type WithoutDeps<Props> = Props extends unknown ? Omit<Props, 'deps'> : never

type AnimeLayoutElement = string | HTMLElement | SVGElement | ComponentPublicInstance | null | undefined

/**
 * A CSS selector, an element, a component instance, or a list of them.
 * Selectors only match inside the group.
 */
export type AnimeLayoutElements = AnimeLayoutElement | readonly (AnimeLayoutElement | readonly AnimeLayoutElement[])[]

/** Props of `<AnimeLayoutGroup>`. */
export interface AnimeLayoutGroupProps {
  /**
   * Element rendered around the children.
   * @default 'div'
   */
  tag?: string
  /**
   * The elements inside the group that animate their own position and size:
   * a selector such as `'.card'`, elements, component instances, or a list of
   * them. Everything inside the group is still measured.
   * @default every element inside the group
   */
  elements?: AnimeLayoutElements
  /**
   * Values that trigger a layout animation when they change, including
   * changes nested inside them. A function entry is read as a getter, such as
   * `() => state.view`, and its result is watched; to pass a function as a
   * value, wrap it in an object. Without `deps`, every re-render of the group
   * animates.
   */
  deps?: readonly unknown[]
  /**
   * Animate only when an entry of `deps` is replaced, not when something
   * nested inside it changes. Read once, when the group is created.
   * @default false
   */
  shallow?: boolean
  /**
   * Anime.js `createLayout()` params. They replace the `layoutOptions` set
   * through `provideAnimeDefaults()` or `app.config.ts` as a whole.
   * Use `elements` instead of `children`. Setting `ease` or `duration`
   * replaces the default spring.
   * @default { ease: spring({ bounce: 0.15, duration: 300 }) }
   */
  layoutOptions?: Omit<AutoLayoutParams, 'children'>
  /**
   * Jump running animations to their end when the browser tab is hidden.
   * AnimeJS pauses every animation while the tab is hidden, which otherwise
   * leaves elements mid-way until the tab is visible again.
   * @default false
   */
  completeOnTabHidden?: boolean
}

/** Default props for nanime components, from `app.config.ts` or `provideAnimeDefaults()`. */
export interface NanimeComponentDefaults {
  /** Default props for `<AnimeTransition>`. */
  transition?: AnimeTransitionProps<ConfigTransitionStyleName>
  /** Default props for `<AnimeTransitionGroup>`. */
  transitionGroup?: WithoutDeps<AnimeTransitionGroupProps<ConfigTransitionStyleName>>
  /** Default props for `<AnimeLayoutGroup>`. */
  layoutGroup?: Omit<AnimeLayoutGroupProps, 'deps' | 'elements'> & {
    /** Selectors for the elements that move on their own, matched inside each group. */
    elements?: string | readonly string[]
  }
}
