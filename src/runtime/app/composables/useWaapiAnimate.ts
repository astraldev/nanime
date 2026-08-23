import { tryOnScopeDispose, useMounted } from '../utils/vue-helpers'
import { shallowRef, toValue, watchEffect, type MaybeRefOrGetter, nextTick } from 'vue'
import type { WAAPIAnimationParams } from 'animejs'
import { normalizeWaapiAnimeTarget } from '../utils/normalize-targets'
import { waapi, type WAAPIAnimation } from 'animejs/waapi'
import { AnimationComponentFlags, getAnimationComponentFlag } from '../utils/normalizers/instance-management'
import { markNanimeInstance, toReactive } from '../utils/create-proxy'

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

  const result = toReactive(animation)
  markNanimeInstance(result, animation)
  return result
}
