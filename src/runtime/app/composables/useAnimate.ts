import { toReactive, tryOnScopeDispose, useMounted } from '@vueuse/core'
import { shallowRef, toValue, watchEffect, type MaybeRefOrGetter, nextTick } from 'vue'
import { normalizeAnimeTarget } from '../utils/normalize-targets'
import type { AnimationParams, TargetsParam } from 'animejs'
import { animate, type JSAnimation } from 'animejs/animation'
import { AnimationComponentFlags, getAnimationComponentFlag } from '../utils/normalizers/instance-management'

export function useAnimate(
  target: Parameters<typeof normalizeAnimeTarget>[0],
  parameters?: MaybeRefOrGetter<AnimationParams>,
): JSAnimation {
  const flag = getAnimationComponentFlag()

  const animation = shallowRef(animate({}, {}))
  const mounted = useMounted()

  if (flag === AnimationComponentFlags.Watchable) {
    let oldTarget: TargetsParam
    watchEffect(() => {
      if (!mounted.value) return
      const targets = normalizeAnimeTarget(target)
      if (oldTarget === targets) return
      if (animation.value) animation.value.revert()
      oldTarget = targets
      const newAnimation = animate(targets, toValue(parameters) || {})
      animation.value = newAnimation
    })

    tryOnScopeDispose(() => {
      animation.value?.revert()
    })
  }
  else {
    nextTick(() => {
      const targets = normalizeAnimeTarget(target)
      if (!targets) return
      const newAnimation = animate(targets, toValue(parameters) || {})
      animation.value = newAnimation
    })
  }

  return toReactive(animation)
}
