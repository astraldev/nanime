import { toValue, type MaybeRef } from '#imports'
import type { MaybeElementRef, VueInstance } from '@vueuse/core'
import type { TargetsParam, DOMTargetsParam } from 'animejs'

function isVueInstance(value: unknown): value is VueInstance {
  return value !== null && typeof value === 'object' && '$el' in value
}

type WaapiElementTargets = VueInstance | HTMLElement | SVGElement | NodeList | string | null
type WaapiTargets = WaapiElementTargets | WaapiElementTargets[] | MaybeRef<WaapiElementTargets> | MaybeRef<WaapiElementTargets>[]
export function normalizeWaapiAnimeTarget(target: WaapiTargets): DOMTargetsParam | null {
  const resolved = toValue(target)

  if (!resolved) return null

  if (isVueInstance(resolved)) {
    return resolved.$el as HTMLElement | SVGElement
  }

  if (Array.isArray(resolved)) {
    const targets = (resolved as WaapiElementTargets[])
      .map(t => normalizeWaapiAnimeTarget(t as WaapiTargets))
      .filter((t): t is DOMTargetsParam => t !== null)
      .flat()
    return targets.length ? (targets as DOMTargetsParam) : null
  }

  return resolved as DOMTargetsParam
}

export function normalizeAnimeTarget(target: TargetsParam | MaybeElementRef | MaybeElementRef[]): TargetsParam {
  const resolved = toValue(target)

  if (!resolved) return []

  if (isVueInstance(resolved)) {
    return resolved.$el as HTMLElement | SVGElement
  }

  if (Array.isArray(resolved)) {
    const targets = resolved
      .map(t => normalizeAnimeTarget(t))
      .filter(t => t !== null && (Array.isArray(t) ? t.length > 0 : true))
      .flat()

    return targets as TargetsParam
  }

  return resolved as TargetsParam
};
