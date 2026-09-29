import type { ComponentPublicInstance, MaybeRef, MaybeRefOrGetter, Ref } from 'vue'
import type {
  AnimationParams,
  ScrollObserver,
  ScrollObserverAxisCallback,
  ScrollObserverParams,
  ScrollThresholdCallback,
  ScrollThresholdParam,
  ScrollThresholdValue,
  TargetsParam,
} from 'animejs'

/** Options for `useAnimate`, `useAnimeTimeline` and `useScrambleText`. */
export interface NanimeInstanceOptions {
  /**
   * When a reactive change rebuilds the instance, continue from the current
   * playhead instead of restarting at zero.
   * @default `nanime.keepTime` in `nuxt.config`, which is `false` unless set
   */
  keepTime?: boolean
}

/**
 * Animation options for `useScrambleText`. `duration`, `delay` and `ease`
 * are not accepted here: the scramble sets its own, so pass them in the
 * scramble options instead.
 */
export type ScrambleAnimationParams = AnimationParams & {
  duration?: never
  delay?: never
  ease?: never
}

/** Options for `useSplitText`. */
export interface SplitTextOptions {
  /**
   * HTML to split, as a string, ref or getter. When it changes, the new text
   * is split in place. Use it for text that changes, and leave the target
   * element empty in the template.
   * @default the target's own content
   */
  html?: MaybeRefOrGetter<string | null | undefined>
}

type ScrollElement = HTMLElement | SVGElement | ComponentPublicInstance | null | undefined

/** An element, selector or template ref for `useAnimeScroll`. */
export type AnimeScrollTarget = TargetsParam | MaybeRef<ScrollElement> | MaybeRef<ScrollElement>[]

/**
 * Parameters for `useAnimeScroll`.
 *
 * When a ref passed as `enter`, `leave`, `repeat` or `axis` changes, the
 * observer updates in place. A function for one of them is an Anime.js
 * callback: it receives the observer and runs again on each refresh, but
 * refs read inside it are not tracked, so pass a ref or computed ref instead.
 */
export interface AnimeScrollParams extends Omit<ScrollObserverParams, 'target' | 'container' | 'enter' | 'leave' | 'repeat' | 'axis'> {
  /**
   * Element whose position drives progress. Pointing it to a new element
   * rebuilds the observer.
   * @default the linked animation's target, else `document.body`
   */
  target?: AnimeScrollTarget
  /**
   * Element that scrolls. Pointing it to a new element rebuilds the observer.
   * @default document.body
   */
  container?: AnimeScrollTarget
  /**
   * Where tracking starts, as `'<container edge> <target edge>'`.
   * @default 'end start'
   */
  enter?: ScrollThresholdValue | ScrollThresholdParam | ScrollThresholdCallback | Readonly<Ref<ScrollThresholdValue | ScrollThresholdParam>>
  /**
   * Where tracking ends, as `'<container edge> <target edge>'`.
   * @default 'start end'
   */
  leave?: ScrollThresholdValue | ScrollThresholdParam | ScrollThresholdCallback | Readonly<Ref<ScrollThresholdValue | ScrollThresholdParam>>
  /**
   * Keep observing after the first pass. When a one-shot observer has
   * finished, setting this ref back to `true` starts a new one.
   * @default true
   */
  repeat?: boolean | ((observer: ScrollObserver) => boolean) | Readonly<Ref<boolean>>
  /**
   * Scroll direction to observe.
   * @default 'y'
   */
  axis?: 'x' | 'y' | ScrollObserverAxisCallback | Readonly<Ref<'x' | 'y'>>
}
