import { tryOnScopeDispose, useMounted } from '../utils/vue-helpers'
import { shallowRef, toValue, watchEffect, type MaybeRefOrGetter, nextTick } from 'vue'
import { normalizeAnimeTarget } from '../utils/normalize-targets'
import type { AnimationParams, TargetsParam } from 'animejs'
import { animate, type JSAnimation } from 'animejs/animation'
import { keepTime } from 'animejs/utils'
import type { NanimeInstanceOptions } from '../utils/types'
import { AnimationComponentFlags, getAnimationComponentFlag } from '../utils/normalizers/instance-management'
import { markNanimeInstance, toReactive } from '../utils/create-proxy'

export function useAnimate(
  target: Parameters<typeof normalizeAnimeTarget>[0],
  parameters?: MaybeRefOrGetter<AnimationParams>,
  options?: NanimeInstanceOptions,
): JSAnimation {
  const flag = getAnimationComponentFlag()
  const buildAnimation = (targets: TargetsParam, params: AnimationParams) => animate(targets, params)
  const rebuildAnimation = options?.keepTime === false ? buildAnimation : keepTime(buildAnimation)

  const animation = shallowRef(animate({}, {}))
  const mounted = useMounted()

  if (flag === AnimationComponentFlags.Watchable) {
    let oldTarget: TargetsParam
    watchEffect(() => {
      if (!mounted.value) return
      const targets = normalizeAnimeTarget(target)
      if (oldTarget === targets) return
      if (options?.keepTime === false && animation.value) animation.value.revert()
      oldTarget = targets
      animation.value = rebuildAnimation(targets, toValue(parameters) || {})
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

  const result = toReactive(animation)
  markNanimeInstance(result, animation)
  return result
}
