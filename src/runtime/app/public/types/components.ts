import type { ComponentPublicInstance } from 'vue'
import type { AnimationParams } from 'animejs'
import type { AutoLayoutParams } from 'animejs/layout'
import type { AnimeMoveParams, AnimeTransitionStyleName, ConfigTransitionStyleName } from './transitions'

/** Order of the leave and enter animations when one element replaces another. */
export type AnimeTransitionMode = 'in-out' | 'out-in' | 'default'

/** Props of `<AnimeTransition>`. */
export interface AnimeTransitionProps<StyleName extends string = AnimeTransitionStyleName> {
  /**
   * How the element appears: a transition style name, or Anime.js params.
   * @default 'fade'
   */
  enterAnimation?: StyleName | AnimationParams
  /**
   * How the element disappears: a transition style name, or Anime.js params.
   * @default 'fade'
   */
  leaveAnimation?: StyleName | AnimationParams
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
}

/** Props of `<AnimeTransitionGroup>`. */
export interface AnimeTransitionGroupProps<StyleName extends string = AnimeTransitionStyleName> {
  /**
   * Element rendered around the items.
   * @default 'div'
   */
  tag?: string
  /**
   * How items appear: a transition style name, or Anime.js params.
   * @default a fade in over 250ms, `out(3)`
   */
  enterAnimation?: StyleName | AnimationParams
  /**
   * How items disappear: a transition style name, or Anime.js params.
   * @default a fade out over 150ms, `in(3)`
   */
  leaveAnimation?: StyleName | AnimationParams
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
}

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
   * Anime.js `createLayout()` params, merged over the configured defaults.
   * Use `elements` instead of `children`. Setting `ease` or `duration`
   * replaces the default spring.
   * @default { ease: spring({ bounce: 0.15, duration: 300 }) }
   */
  layoutOptions?: Omit<AutoLayoutParams, 'children'>
}

/** Default props for nanime components, from `app.config.ts` or `provideAnimeDefaults()`. */
export interface NanimeComponentDefaults {
  /** Default props for `<AnimeTransition>`. */
  transition?: AnimeTransitionProps<ConfigTransitionStyleName>
  /** Default props for `<AnimeTransitionGroup>`. */
  transitionGroup?: AnimeTransitionGroupProps<ConfigTransitionStyleName>
  /** Default props for `<AnimeLayoutGroup>`. */
  layoutGroup?: Omit<AnimeLayoutGroupProps, 'deps' | 'elements'> & {
    /** Selectors for the elements that move on their own, matched inside each group. */
    elements?: string | readonly string[]
  }
}
