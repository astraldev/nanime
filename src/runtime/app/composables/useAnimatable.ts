import { createAnimatable } from 'animejs/animatable'
import { toReactive, tryOnScopeDispose, useMounted } from '@vueuse/core'
import { shallowRef, toValue, watchEffect, type MaybeRefOrGetter, nextTick } from 'vue'
import { normalizeAnimeTarget } from '../utils/normalize-targets'
import type { AnimatableObject, AnimatableParams, TargetsParam } from 'animejs'
import { AnimationComponentFlags, getAnimationComponentFlag } from '../utils/normalizers/instance-management'

export function useAnimatable(
  target: Parameters<typeof normalizeAnimeTarget>[0],
  options?: MaybeRefOrGetter<AnimatableParams>,
): AnimatableObject {
  const flag = getAnimationComponentFlag()

  const animatable = shallowRef(createAnimatable({}, {}))
  const mounted = useMounted()

  if (flag === AnimationComponentFlags.Watchable) {
    let oldTarget: TargetsParam
    watchEffect(() => {
      if (!mounted.value) return
      const targets = normalizeAnimeTarget(target)
      if (oldTarget === targets) return
      oldTarget = targets
      const newAnimatable = createAnimatable(targets, toValue(options) || {})
      animatable.value = newAnimatable
    })

    tryOnScopeDispose(() => {
      animatable.value.revert()
    })
  }
  else {
    nextTick(() => {
      const targets = normalizeAnimeTarget(target)
      if (!targets) return
      const newAnimatable = createAnimatable(targets, toValue(options) || {})
      animatable.value = newAnimatable
    })
  }

  return toReactive(animatable)
}
