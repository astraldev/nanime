import { tryOnScopeDispose, useMounted, toReactive } from '../utils/vue-helpers'
import { onMounted, shallowRef, toValue, watch, type MaybeRefOrGetter, nextTick } from 'vue'
import type { DOMTargetsParam, WAAPIAnimationParams } from 'animejs'
import { normalizeWaapiAnimeTarget, sameTargets } from '../utils/targets'
import { snapshotParameters } from '../utils/snapshot-parameters'
import { waapi, type WAAPIAnimation } from 'animejs/waapi'
import { AnimationComponentFlags, getAnimationComponentFlag } from '../utils/instance/instance-management'
import { markNanimeInstance, unwrapNanimeProxies } from '../utils/proxy'
import { deepEqualWithSkip } from '../utils/deep-equal'

const callbacks = ['onComplete']

/**
 * Runs an Anime.js `waapi.animate()` on `target` when the component mounts
 * and reverts it when the scope is disposed.
 *
 * When `target` or `parameters` change, the animation is rebuilt.
 */
export function useWaapiAnimate(
  target: Parameters<typeof normalizeWaapiAnimeTarget>[0],
  parameters?: MaybeRefOrGetter<WAAPIAnimationParams>,
): WAAPIAnimation {
  const flag = getAnimationComponentFlag()
  const mounted = useMounted()
  const animation = shallowRef(waapi.animate([], {}))

  const resolveTargets = () => normalizeWaapiAnimeTarget(target)
  const resolveParameters = () => toValue(parameters) || {}

  const rebuildAnimation = (targets: DOMTargetsParam) => {
    animation.value?.revert()
    animation.value = waapi.animate(targets, unwrapNanimeProxies(resolveParameters()))
  }

  if (flag === AnimationComponentFlags.Watchable) {
    let previous: { targets: DOMTargetsParam, snapshot: Record<string, unknown> } | null = null

    const sync = () => {
      if (!mounted.value) return
      const targets = resolveTargets()
      if (!targets) return
      const snapshot = snapshotParameters(resolveParameters())
      if (
        previous
        && sameTargets(previous.targets, targets)
        && deepEqualWithSkip(previous.snapshot, snapshot, callbacks)
      ) return

      previous = { targets, snapshot }
      rebuildAnimation(targets)
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
      rebuildAnimation(targets)
    })
  }

  const result = toReactive(animation)
  markNanimeInstance(result, animation)
  return result
}
