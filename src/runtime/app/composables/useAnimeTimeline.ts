import { tryOnScopeDispose, useMounted } from '../utils/vue-helpers'
import { shallowRef, toValue, watch, nextTick, type MaybeRefOrGetter } from 'vue'
import type { TimelineParams } from 'animejs'
import { createTimeline, type Timeline } from 'animejs/timeline'
import { keepTime } from 'animejs/utils'
import type { NanimeInstanceOptions } from '../public/types'
import { normalizeAnimeTarget } from '../utils/targets'
import { createBufferedProxy, hasNanimeProxy, resolveNanimeInstance, unwrapNanimeProxies, type BufferedProxyReturns } from '../utils/proxy'
import { AnimationComponentFlags, getAnimationComponentFlag } from '../utils/instance/instance-management'
import { resolveKeepTime } from '../utils/global-options'
import { deepEqualWithSkip } from '../utils/deep-equal'
import { snapshotParameters } from '../utils/snapshot-parameters'
import { SHARED_ANIME_JS_CALLBACKS } from '../utils/instance/shared-callbacks'

const CONTENT_METHODS = new Set([
  'add', 'set', 'remove', 'call', 'label', 'sync', 'stretch',
])

const CONTROL_METHODS = new Set([
  'refresh', 'revert',
  'play', 'pause', 'resume', 'restart', 'reset',
  'reverse', 'alternate', 'seek', 'cancel',
  'complete', 'init', 'resetTime',
])

const CHAINABLE_METHODS = new Set([...CONTENT_METHODS, ...CONTROL_METHODS])
const TARGET_METHODS = new Set(['set', 'remove'])

const callbacks = [...SHARED_ANIME_JS_CALLBACKS]

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * Creates an Anime.js `createTimeline()` when the component mounts and
 * reverts it when the scope is disposed.
 *
 * `add()`, `set()` and `remove()` take template refs, component refs and
 * getters as targets, as well as selectors. When `parameters` change, the
 * timeline is rebuilt; pass `keepTime: true` to keep its playhead. Methods
 * called before mount run once the timeline exists.
 */
export function useAnimeTimeline(
  parameters?: MaybeRefOrGetter<TimelineParams>,
  options?: NanimeInstanceOptions,
): BufferedProxyReturns<Timeline> {
  const flag = getAnimationComponentFlag()
  const keepsTime = resolveKeepTime(options?.keepTime)
  const mounted = useMounted()
  const timeline = shallowRef<Timeline | null>(null)

  const { proxy, flushBuffer } = createBufferedProxy<Timeline>(timeline, {
    chainableMethods: CHAINABLE_METHODS,
    replayMethods: CONTENT_METHODS,
    transformArgs: (method, args) => {
      // add(targets, animParams, position?) — normalize when second arg is AnimationParams
      if (method === 'add' && args.length >= 2 && isPlainObject(args[1])) {
        return [normalizeAnimeTarget(args[0]), ...args.slice(1)]
      }
      // set(targets, params, position?) and remove(targets, propertyName?)
      if (TARGET_METHODS.has(method)) {
        return [normalizeAnimeTarget(args[0]), ...args.slice(1)]
      }
      // sync(nanimeProxy, position?) — unwrap nanime proxy to raw instance
      if (method === 'sync' && args.length >= 1) {
        return [resolveNanimeInstance(args[0]), ...args.slice(1)]
      }
      return args
    },
  })

  const resolveParameters = () => unwrapNanimeProxies(toValue(parameters) || {})

  const buildTimeline = (params: TimelineParams) => {
    const next = createTimeline(params)
    timeline.value = next
    flushBuffer()
    return next
  }
  const buildKeepingTime = keepTime(buildTimeline)

  const rebuildTimeline = (params: TimelineParams) => {
    if (hasNanimeProxy(toValue(parameters) || {})) {
      timeline.value?.cancel()
      buildTimeline(params)
      return
    }
    if (!keepsTime) {
      timeline.value?.revert()
      buildTimeline(params)
      return
    }
    const wasPaused = timeline.value?.paused
    const next = buildKeepingTime(params)
    if (wasPaused === false) next.resume()
    else if (wasPaused) next.pause()
  }

  if (flag === AnimationComponentFlags.Watchable) {
    let previous: Record<string, unknown> | null = null

    watch(
      [mounted, () => snapshotParameters(resolveParameters())],
      ([isMounted, snapshot]) => {
        if (!isMounted) return
        if (previous && deepEqualWithSkip(previous, snapshot, callbacks)) return
        previous = snapshot
        rebuildTimeline(resolveParameters())
      },
      { immediate: true },
    )
  }
  else {
    nextTick(() => rebuildTimeline(resolveParameters()))
  }

  tryOnScopeDispose(() => {
    timeline.value?.revert()
  })

  return proxy
}
