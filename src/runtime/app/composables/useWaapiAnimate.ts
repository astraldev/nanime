import { toReactive, tryOnScopeDispose, useMounted } from '@vueuse/core'
import { shallowRef, toValue, watchEffect, type MaybeRefOrGetter, nextTick } from 'vue'
import type { WAAPIAnimationParams } from 'animejs'
import { normalizeWaapiAnimeTarget } from '../utils/normalize-targets'
import { waapi, type WAAPIAnimation } from 'animejs/waapi'
import { AnimationComponentFlags, getAnimationComponentFlag } from '../utils/normalizers/instance-management'

export function useWaapiAnimate(
  target: Parameters<typeof normalizeWaapiAnimeTarget>[0],
  parameters?: MaybeRefOrGetter<WAAPIAnimationParams>,
): WAAPIAnimation {
  const flag = getAnimationComponentFlag()

  const animation = shallowRef(waapi.animate([], {}))
  const mounted = useMounted()

  if (flag === AnimationComponentFlags.Watchable) {
    watchEffect(() => {
      const targets = normalizeWaapiAnimeTarget(target)
      if (!mounted.value || !targets) return
      if (animation.value) animation.value.revert()
      const newAnimation = waapi.animate(targets, toValue(parameters) || {})
      animation.value = newAnimation
    })

    tryOnScopeDispose(() => {
      animation.value?.revert()
    })
  }
  else {
    nextTick(() => {
      const targets = normalizeWaapiAnimeTarget(target)
      if (!targets) return
      if (animation.value) animation.value.revert()
      const newAnimation = waapi.animate(targets, toValue(parameters) || {})
      animation.value = newAnimation
    })
  }

  return toReactive(animation)
}
