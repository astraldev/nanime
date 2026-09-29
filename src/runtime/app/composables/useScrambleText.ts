import { tryOnScopeDispose, useMounted, toReactive } from '../utils/vue-helpers'
import { shallowRef, toValue, watch, type MaybeRefOrGetter, nextTick } from 'vue'
import { hasTargets, normalizeAnimeTarget, sameTargets } from '../utils/targets'
import { snapshotParameters } from '../utils/snapshot-parameters'
import type { AnimationParams, ScrambleTextParams } from 'animejs'
import { animate, type JSAnimation } from 'animejs/animation'
import { keepTime } from 'animejs/utils'
import type { NanimeInstanceOptions, ScrambleAnimationParams } from '../public/types'
import { scrambleText } from 'animejs/text'
import { AnimationComponentFlags, getAnimationComponentFlag } from '../utils/instance/instance-management'
import { markNanimeInstance } from '../utils/proxy'
import { resolveKeepTime } from '../utils/global-options'
import { deepEqualWithSkip } from '../utils/deep-equal'
import { SHARED_ANIME_JS_CALLBACKS } from '../utils/instance/shared-callbacks'

const callbacks = [...SHARED_ANIME_JS_CALLBACKS]

/**
 * Scrambles the text of `target` with Anime.js `scrambleText()` when the
 * component mounts and reverts it when the scope is disposed.
 *
 * When `target`, `animationOptions` or `scrambleOptions` change, the
 * animation is rebuilt. Pass `keepTime: true` to continue from the current
 * playhead instead of restarting.
 */
export function useScrambleText(
  target: Parameters<typeof normalizeAnimeTarget>[0],
  animationOptions?: MaybeRefOrGetter<ScrambleAnimationParams>,
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
  const resolveAnimationOptions = (): AnimationParams => toValue(animationOptions) || {}
  const resolveScrambleOptions = () => toValue(scrambleOptions) || {}

  if (flag === AnimationComponentFlags.Watchable) {
    let previous: {
      targets: NonNullable<ReturnType<typeof normalizeAnimeTarget>>
      animOptions: Record<string, unknown>
      scrambleOpts: Record<string, unknown>
    } | null = null

    watch(
      [
        mounted,
        resolveTargets,
        () => snapshotParameters(resolveAnimationOptions()),
        () => snapshotParameters(resolveScrambleOptions()),
      ],
      ([isMounted, targets, animOptions, scrambleOpts]) => {
        if (!isMounted || !hasTargets(targets)) return
        if (
          previous
          && sameTargets(previous.targets, targets)
          && deepEqualWithSkip(previous.animOptions, animOptions, callbacks)
          && deepEqualWithSkip(previous.scrambleOpts, scrambleOpts)
        ) return

        previous = { targets, animOptions, scrambleOpts }
        if (!keepsTime && animation.value) animation.value.revert()
        animation.value = rebuildAnimation(targets, {
          ...resolveAnimationOptions(),
          innerHTML: scrambleText(resolveScrambleOptions()),
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
