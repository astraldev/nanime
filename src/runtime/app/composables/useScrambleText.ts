import { tryOnScopeDispose, useMounted, toReactive } from '../utils/vue-helpers'
import { shallowRef, toValue, watch, type MaybeRefOrGetter, nextTick } from 'vue'
import { normalizeAnimeTarget } from '../utils/normalize-targets'
import type { AnimationParams, ScrambleTextParams } from 'animejs'
import { animate, type JSAnimation } from 'animejs/animation'
import { keepTime } from 'animejs/utils'
import type { NanimeInstanceOptions } from '../utils/types'
import { scrambleText } from 'animejs/text'
import { AnimationComponentFlags, getAnimationComponentFlag } from '../utils/normalizers/instance-management'
import { markNanimeInstance } from '../utils/create-proxy'
import { resolveKeepTime } from '../utils/global-options'
import { deepEqualWithSkip } from '../utils/deep-equal'
import { SHARED_ANIME_JS_CALLBACKS } from '../utils/normalizers/shared-callbacks'

const callbacks = [...SHARED_ANIME_JS_CALLBACKS]

export function useScrambleText(
  target: Parameters<typeof normalizeAnimeTarget>[0],
  animationOptions?: MaybeRefOrGetter<AnimationParams>,
  scrambleOptions?: MaybeRefOrGetter<ScrambleTextParams>,
  options?: NanimeInstanceOptions,
): JSAnimation {
  const flag = getAnimationComponentFlag()
  const keepsTime = resolveKeepTime(options?.keepTime)

  const buildAnimation = (
    targets: NonNullable<ReturnType<typeof normalizeAnimeTarget>>,
    params: AnimationParams,
  ) => animate(targets, params)
  const rebuildAnimation = keepsTime ? keepTime(buildAnimation) : buildAnimation

  const animation = shallowRef(animate({}, {}))
  const mounted = useMounted()

  const resolveTargets = () => normalizeAnimeTarget(target)
  const resolveAnimationOptions = () => toValue(animationOptions) || {}
  const resolveScrambleOptions = () => toValue(scrambleOptions) || {}

  if (flag === AnimationComponentFlags.Watchable) {
    let previous: {
      targets: NonNullable<ReturnType<typeof normalizeAnimeTarget>>
      animOptions: AnimationParams
      scrambleOpts: ScrambleTextParams
    } | null = null

    watch(
      [mounted, resolveTargets, resolveAnimationOptions, resolveScrambleOptions],
      ([isMounted, targets, animOptions, scrambleOpts]) => {
        if (!isMounted || !targets) return
        if (
          previous
          && previous.targets === targets
          && deepEqualWithSkip(previous.animOptions, animOptions, callbacks)
          && deepEqualWithSkip(previous.scrambleOpts, scrambleOpts)
        ) return

        previous = { targets, animOptions, scrambleOpts }
        if (!keepsTime && animation.value) animation.value.revert()
        animation.value = rebuildAnimation(targets, {
          ...animOptions,
          innerHTML: scrambleText(scrambleOpts),
        })
      },
      { immediate: true },
    )

    tryOnScopeDispose(() => {
      animation.value?.revert()
    })
  }
  else {
    nextTick(() => {
      const targets = resolveTargets()
      if (!targets) return
      animation.value = animate(targets, {
        ...resolveAnimationOptions(),
        innerHTML: scrambleText(resolveScrambleOptions()),
      })
    })
  }

  const result = toReactive(animation)
  markNanimeInstance(result, animation)
  return result
}
