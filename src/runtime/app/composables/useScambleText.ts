import { tryOnScopeDispose, useMounted } from '../utils/vue-helpers'
import { shallowRef, toValue, watchEffect, type MaybeRefOrGetter, nextTick } from 'vue'
import { normalizeAnimeTarget } from '../utils/normalize-targets'
import type { AnimationParams, ScrambleTextParams } from 'animejs'
import { animate, type JSAnimation } from 'animejs/animation'
import { keepTime } from 'animejs/utils'
import type { NanimeInstanceOptions } from '../utils/types'
import { scrambleText } from 'animejs/text'
import { AnimationComponentFlags, getAnimationComponentFlag } from '../utils/normalizers/instance-management'
import { markNanimeInstance, toReactive } from '../utils/create-proxy'

export function useScrambleText(
  target: Parameters<typeof normalizeAnimeTarget>[0],
  animationOptions?: MaybeRefOrGetter<AnimationParams>,
  scrambleOptions?: MaybeRefOrGetter<ScrambleTextParams>,
  options?: NanimeInstanceOptions,
): JSAnimation {
  const flag = getAnimationComponentFlag()

  const buildAnimation = (
    targets: NonNullable<ReturnType<typeof normalizeAnimeTarget>>,
    params: AnimationParams,
  ) => animate(targets, params)
  const rebuildAnimation = options?.keepTime === false ? buildAnimation : keepTime(buildAnimation)

  const animation = shallowRef(animate({}, {}))
  const mounted = useMounted()

  function buildParams(): AnimationParams {
    const anim = toValue(animationOptions) || {}
    const scramble = toValue(scrambleOptions) || {}
    return {
      ...anim,
      innerHTML: scrambleText(scramble),
    }
  }

  if (flag === AnimationComponentFlags.Watchable) {
    watchEffect(() => {
      if (!mounted.value) return
      const targets = normalizeAnimeTarget(target)
      if (!targets) return
      if (options?.keepTime === false && animation.value) animation.value.revert()
      animation.value = rebuildAnimation(targets, buildParams())
    })

    tryOnScopeDispose(() => {
      animation.value?.revert()
    })
  }
  else {
    nextTick(() => {
      const targets = normalizeAnimeTarget(target)
      if (!targets) return
      animation.value = animate(targets, buildParams())
    })
  }

  const result = toReactive(animation)
  markNanimeInstance(result, animation)
  return result
}
