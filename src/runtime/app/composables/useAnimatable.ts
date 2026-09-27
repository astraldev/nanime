import { createAnimatable } from 'animejs/animatable'
import { tryOnScopeDispose, useMounted, toReactive } from '../utils/vue-helpers'
import { onMounted, shallowRef, toValue, watch, type MaybeRefOrGetter, nextTick } from 'vue'
import { hasTargets, normalizeAnimeTarget, sameTargets } from '../utils/targets'
import type { AnimatableObject, AnimatableParams, TargetsParam } from 'animejs'
import { AnimationComponentFlags, getAnimationComponentFlag } from '../utils/instance/instance-management'
import { markNanimeInstance } from '../utils/proxy'

/**
 * Creates an Anime.js `createAnimatable()` for `target` once it is mounted.
 * The animatable is rebuilt when the resolved target changes, and reverted
 * when the scope is disposed.
 */
export function useAnimatable(
  target: Parameters<typeof normalizeAnimeTarget>[0],
  options?: MaybeRefOrGetter<AnimatableParams>,
): AnimatableObject {
  const flag = getAnimationComponentFlag()

  const animatable = shallowRef(createAnimatable({}, {}))
  const mounted = useMounted()

  const resolveTargets = () => normalizeAnimeTarget(target)

  if (flag === AnimationComponentFlags.Watchable) {
    let previous: TargetsParam | null = null

    const sync = () => {
      if (!mounted.value) return
      const targets = resolveTargets()
      if (previous !== null && sameTargets(previous, targets)) return
      previous = targets
      animatable.value.revert()
      animatable.value = hasTargets(targets)
        ? createAnimatable(targets, toValue(options) || {})
        : createAnimatable({}, {})
    }

    watch(resolveTargets, sync)
    onMounted(sync)

    tryOnScopeDispose(() => {
      animatable.value.revert()
    })
  }
  else {
    nextTick(() => {
      const targets = resolveTargets()
      if (!hasTargets(targets)) return
      animatable.value = createAnimatable(targets, toValue(options) || {})
    })
  }

  const result = toReactive(animatable)
  markNanimeInstance(result, animatable)
  return result
}
