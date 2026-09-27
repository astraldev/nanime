import { tryOnScopeDispose, useMounted, toReactive } from '../utils/vue-helpers'
import { onMounted, shallowRef, toValue, watch, type MaybeRefOrGetter, nextTick } from 'vue'
import { normalizeAnimeTarget, sameTargets } from '../utils/targets'
import { snapshotParameters } from '../utils/snapshot-parameters'
import type { AnimationParams, TargetsParam } from 'animejs'
import { animate, type JSAnimation } from 'animejs/animation'
import { keepTime } from 'animejs/utils'
import type { NanimeInstanceOptions } from '../public/types'
import { AnimationComponentFlags, getAnimationComponentFlag } from '../utils/instance/instance-management'
import { hasNanimeProxy, markNanimeInstance, unwrapNanimeProxies } from '../utils/proxy'
import { deepEqualWithSkip } from '../utils/deep-equal'
import { resolveKeepTime } from '../utils/global-options'
import { SHARED_ANIME_JS_CALLBACKS } from '../utils/instance/shared-callbacks'

const callbacks = [...SHARED_ANIME_JS_CALLBACKS]

/**
 * Runs an Anime.js `animate()` on `target` once it is mounted. The animation
 * is rebuilt when `target` or `parameters` change, and reverted when the
 * scope is disposed.
 */
export function useAnimate(
  target: Parameters<typeof normalizeAnimeTarget>[0],
  parameters?: MaybeRefOrGetter<AnimationParams>,
  options?: NanimeInstanceOptions,
): JSAnimation {
  const flag = getAnimationComponentFlag()
  const mounted = useMounted()
  const animation = shallowRef(animate({}, {}))

  const keepsTime = resolveKeepTime(options?.keepTime)

  const create = (targets: TargetsParam, params: AnimationParams) => animate(targets, params)
  const createKeepingTime = keepsTime ? keepTime(create) : create

  const resolveTargets = () => normalizeAnimeTarget(target)
  const resolveParameters = () => toValue(parameters) || {}
  const resolveBoundParameters = () => unwrapNanimeProxies(resolveParameters())

  const rebuildAnimation = (targets: TargetsParam, params: AnimationParams) => {
    if (hasNanimeProxy(resolveParameters())) {
      animation.value?.cancel()
      animation.value = create(targets, params)
      return
    }

    if (!keepsTime) animation.value?.revert()
    animation.value = createKeepingTime(targets, params)
  }

  if (flag === AnimationComponentFlags.Watchable) {
    let previous: { targets: TargetsParam, snapshot: Record<string, unknown> } | null = null

    const sync = () => {
      if (!mounted.value) return
      const targets = resolveTargets()
      const snapshot = snapshotParameters(resolveParameters())
      if (
        previous
        && sameTargets(previous.targets, targets)
        && deepEqualWithSkip(previous.snapshot, snapshot, callbacks)
      ) return

      previous = { targets, snapshot }
      rebuildAnimation(targets, resolveBoundParameters())
    }

    watch([resolveTargets, () => snapshotParameters(resolveParameters())], sync)
    onMounted(sync)

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
