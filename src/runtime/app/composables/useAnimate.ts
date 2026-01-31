import { useMounted, type MaybeElementRef } from '@vueuse/core'
import { shallowReactive, toValue, watchEffect, type MaybeRefOrGetter } from '#imports'
import { normalizeAnimeTarget } from '../utils/normalize-targets'
import type { TargetsParam, AnimationParams } from 'animejs'
import { animate } from 'animejs/animation'

export function useAnimate(
  target: TargetsParam | MaybeElementRef,
  options?: MaybeRefOrGetter<AnimationParams>,
) {
  const mounted = useMounted()
  const animation = shallowReactive(animate({}, {}))

  watchEffect(() => {
    if (!mounted.value) return
    const targets = normalizeAnimeTarget(toValue(target))
    const newAnimation = animate(targets, toValue(options) || {})
    Object.assign(animation, newAnimation)
  })

  return animation
}
