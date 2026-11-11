import { tryOnScopeDispose, useMounted, toReactive } from '../utils/vue-helpers'
import { onMounted, shallowRef, toValue, watch, type MaybeRefOrGetter, nextTick } from 'vue'
import { normalizeAnimeTarget, sameTargets } from '../utils/targets'
import { snapshotParameters } from '../utils/snapshot-parameters'
import type { AnimationParams, TargetsParam } from 'animejs'
import { animate, type JSAnimation } from 'animejs/animation'
import { keepTime } from 'animejs/utils'
import type { NanimeAnimateOptions } from '../public/types'
import { AnimationComponentFlags, getAnimationComponentFlag } from '../utils/instance/instance-management'
import { hasNanimeProxy, markNanimeInstance, unwrapNanimeProxies } from '../utils/proxy'
import { deepEqualWithSkip } from '../utils/deep-equal'
import { resolveRebuild } from '../utils/global-options'
import { useComposableDefaults } from '../utils/component-defaults'
import { useReducedMotion } from '../utils/reduced-motion'
import { SHARED_ANIME_JS_CALLBACKS } from '../utils/instance/shared-callbacks'

const callbacks = [...SHARED_ANIME_JS_CALLBACKS]

function hasBlendComposition(params: AnimationParams) {
  if (params.composition === 'blend') return true
  return Object.values(params).some(value => typeof value === 'object' && value !== null && 'composition' in value && value.composition === 'blend')
}

/**
 * Runs an AnimeJS `animate()` on `target` when the component mounts and
 * reverts it when the scope is disposed.
 *
 * When `target` or `parameters` change, the animation is rebuilt. Set
 * `rebuild` to change how.
 */
export function useAnimate(
  target: Parameters<typeof normalizeAnimeTarget>[0],
  parameters?: MaybeRefOrGetter<AnimationParams>,
  options?: NanimeAnimateOptions,
): JSAnimation {
  const flag = getAnimationComponentFlag()
  const mounted = useMounted()
  const animation = shallowRef(animate({}, {}))

  const rebuild = resolveRebuild(options?.rebuild, true)
  const keepsTime = rebuild === 'keepTime'
  const keepsValue = rebuild === 'keepValue'

  const { withReducedMotion } = useReducedMotion()
  const create = (targets: TargetsParam, params: AnimationParams) => animate(targets, withReducedMotion(params))
  const createKeepingTime = keepsTime ? keepTime(create) : create

  const resolveTargets = () => normalizeAnimeTarget(target)
  const resolveDefaults = useComposableDefaults('animate')
  const resolveParameters = (): AnimationParams => ({ ...resolveDefaults(), ...toValue(parameters) })
  const resolveBoundParameters = () => unwrapNanimeProxies(resolveParameters())

  let firstAnimation: JSAnimation | null = null
  let keptAnimations: JSAnimation[] = []
  let lastTargets: TargetsParam | null = null

  const revertAll = () => {
    animation.value.revert()
    for (const kept of [...keptAnimations].reverse()) kept.revert()
    keptAnimations = []
    firstAnimation?.revert()
    firstAnimation = null
  }

  const keepsOldRunning = (params: AnimationParams) => {
    const old = animation.value
    return keepsValue && hasBlendComposition(params) && !old.paused && !old.completed && Number.isFinite(old.iterationCount)
  }

  const rebuildFromCurrentValues = (targets: TargetsParam, params: AnimationParams) => {
    if (lastTargets && !sameTargets(lastTargets, targets)) revertAll()
    else if (lastTargets && keepsOldRunning(params)) keptAnimations = [...keptAnimations.filter(kept => !kept.completed), animation.value]
    else animation.value.cancel()
    lastTargets = targets
    animation.value = create(targets, params)
    firstAnimation ??= animation.value
  }

  const rebuildAnimation = (targets: TargetsParam, params: AnimationParams) => {
    if (keepsValue || hasNanimeProxy(resolveParameters())) return rebuildFromCurrentValues(targets, params)
    if (!keepsTime) animation.value.revert()
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

    tryOnScopeDispose(revertAll)
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
