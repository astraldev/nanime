import type { ComponentPublicInstance, MaybeRefOrGetter, Ref } from 'vue'
import type { WaapiTimelineMembers } from './types'

/**
 * An element, a component instance, or an array of elements.
 */
export type WaapiTimelineElement
  = | HTMLElement
    | SVGElement
    | HTMLElement[]
    | SVGElement[]
    | ComponentPublicInstance

/**
 * A target for `useWaapiTimeline()`: a DOM target, a component instance, or a
 * ref/getter that resolves to one of them.
 */
export type WaapiTimelineRefTarget
  = | WaapiTimelineElement
    | string
    | null
    | undefined
    | MaybeRefOrGetter<WaapiTimelineElement | string | null | undefined>

/**
 * A native Web Animations timeline from `useWaapiTimeline()`.
 *
 * Same members as `WaapiTimeline`, with a reactive `isRunning`.
 */
export type WaapiTimelineRef = WaapiTimelineMembers<WaapiTimelineRef, Readonly<Ref<boolean>>, WaapiTimelineRefTarget>
