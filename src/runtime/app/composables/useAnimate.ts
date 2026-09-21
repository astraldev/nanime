import { tryOnScopeDispose, useMounted, toReactive } from '../utils/vue-helpers'
import { shallowRef, toValue, watch, type MaybeRefOrGetter, nextTick } from 'vue'
import { normalizeAnimeTarget } from '../utils/normalize-targets'
import type { AnimationParams, TargetsParam } from 'animejs'
import { animate, type JSAnimation } from 'animejs/animation'
import { keepTime } from 'animejs/utils'
import type { NanimeInstanceOptions } from '../utils/types'
import { AnimationComponentFlags, getAnimationComponentFlag } from '../utils/normalizers/instance-management'
import { hasNanimeProxy, markNanimeInstance, unwrapNanimeProxies } from '../utils/create-proxy'
import { shallowEqual } from '../utils/shallow-equal'

export function useAnimate(
  target: Parameters<typeof normalizeAnimeTarget>[0],
  parameters?: MaybeRefOrGetter<AnimationParams>,
  options?: NanimeInstanceOptions,
): JSAnimation {
  const flag = getAnimationComponentFlag()
  const mounted = useMounted()
  const animation = shallowRef(animate({}, {}))

  const create = (targets: TargetsParam, params: AnimationParams) => animate(targets, params)
  const createKeepingTime = options?.keepTime === false ? create : keepTime(create)

  const resolveTargets = () => normalizeAnimeTarget(target)
  const resolveParameters = () => toValue(parameters) || {}
  const resolveBoundParameters = () => unwrapNanimeProxies(resolveParameters())

  const rebuildAnimation = (targets: TargetsParam, params: AnimationParams) => {
    if (hasNanimeProxy(resolveParameters())) {
      animation.value?.cancel()
      animation.value = create(targets, params)
      return
    }

    if (options?.keepTime === false) animation.value?.revert()
    animation.value = createKeepingTime(targets, params)
  }

  if (flag === AnimationComponentFlags.Watchable) {
    let previous: { targets: TargetsParam, params: AnimationParams } | null = null

    watch(
      [mounted, resolveTargets, resolveBoundParameters],
      ([isMounted, targets, params]) => {
        if (!isMounted) return
        if (previous && previous.targets === targets && shallowEqual(previous.params, params)) return

        previous = { targets, params }
        rebuildAnimation(targets, params)
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
      rebuildAnimation(targets, resolveBoundParameters())
    })
  }

  const result = toReactive(animation)
  markNanimeInstance(result, animation)
  return result
}
