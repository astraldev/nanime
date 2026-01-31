import { createAnimatable } from 'animejs/animatable'
import { useMounted, type MaybeElementRef } from '@vueuse/core'
import { shallowReactive, toValue, watchEffect, type MaybeRefOrGetter } from '#imports'
import { normalizeAnimeTarget } from '../utils/normalize-targets'
import type { TargetsParam, AnimatableParams } from 'animejs'

export function useAnimatable(
  target: TargetsParam | MaybeElementRef,
  options?: MaybeRefOrGetter<AnimatableParams>,
) {
  const mounted = useMounted()
  const animatable = shallowReactive(createAnimatable({}, {}))

  watchEffect(() => {
    if (!mounted.value) return
    const targets = normalizeAnimeTarget(toValue(target))
    const newAnimatable = createAnimatable(targets, toValue(options) || {})
    Object.assign(animatable, newAnimatable)
  })

  return animatable
}
