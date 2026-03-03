import { createAnimatable } from 'animejs/animatable'
import { tryOnScopeDispose, useMounted } from '@vueuse/core'
import { shallowReactive, toValue, watchEffect, type MaybeRefOrGetter } from 'vue'
import { normalizeAnimeTarget } from '../utils/normalize-targets'
import type { AnimatableObject, AnimatableParams, TargetsParam } from 'animejs'

export function useAnimatable(
  target: Parameters<typeof normalizeAnimeTarget>[0],
  params?: MaybeRefOrGetter<AnimatableParams>,
): AnimatableObject {
  const mounted = useMounted()
  const animatable = shallowReactive(createAnimatable({}, {}))

  let oldTarget: TargetsParam
  watchEffect(() => {
    if (!mounted.value) return
    const targets = normalizeAnimeTarget(target)
    if (oldTarget === targets) return
    oldTarget = targets
    const newAnimatable = createAnimatable(targets, toValue(params) || {})
    Object.assign(animatable, newAnimatable)
  })

  tryOnScopeDispose(() => {
    animatable.revert()
  })

  return animatable
}
