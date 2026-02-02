import { createAnimatable } from 'animejs/animatable'
import { tryOnScopeDispose, useMounted } from '@vueuse/core'
import { shallowReactive, toValue, watchEffect, type MaybeRefOrGetter } from '#imports'
import { normalizeAnimeTarget } from '../utils/normalize-targets'
import type { AnimatableObject, AnimatableParams } from 'animejs'

export function useAnimatable(
  target: Parameters<typeof normalizeAnimeTarget>[0],
  options?: MaybeRefOrGetter<AnimatableParams>,
): AnimatableObject {
  const mounted = useMounted()
  const animatable = shallowReactive(createAnimatable({}, {}))

  watchEffect(() => {
    if (!mounted.value) return
    const targets = normalizeAnimeTarget(target)
    const newAnimatable = createAnimatable(targets, toValue(options) || {})
    Object.assign(animatable, newAnimatable)
  })

  tryOnScopeDispose(() => {
    animatable.revert()
  })

  return animatable
}
