import { toReactive, tryOnScopeDispose, useMounted } from '@vueuse/core'
import { shallowRef, toValue, watchEffect, type MaybeRefOrGetter } from 'vue'
import { normalizeAnimeTarget } from '../utils/normalize-targets'
import type { AnimationParams, TargetsParam } from 'animejs'
import { animate, type JSAnimation } from 'animejs/animation'

export function useAnimate(
  target: Parameters<typeof normalizeAnimeTarget>[0],
  params?: MaybeRefOrGetter<AnimationParams>,
): JSAnimation {
  const mounted = useMounted()
  const animation = shallowRef(animate({}, {}))

  let oldTarget: TargetsParam
  watchEffect(() => {
    if (!mounted.value) return
    const targets = normalizeAnimeTarget(target)
    if (oldTarget === targets) return
    if (animation.value) animation.value.revert()
    oldTarget = targets
    const newAnimation = animate(targets, toValue(params) || {})
    animation.value = newAnimation
  })

  tryOnScopeDispose(() => {
    animation.value?.revert()
  })

  return toReactive(animation)
}
