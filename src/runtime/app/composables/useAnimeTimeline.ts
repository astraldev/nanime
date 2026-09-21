import { tryOnScopeDispose, useMounted } from '../utils/vue-helpers'
import { shallowRef, toValue, watch, nextTick, type MaybeRefOrGetter } from 'vue'
import type { TimelineParams } from 'animejs'
import { createTimeline, type Timeline } from 'animejs/timeline'
import { keepTime } from 'animejs/utils'
import type { NanimeInstanceOptions } from '../utils/types'
import { normalizeAnimeTarget } from '../utils/normalize-targets'
import { createBufferedProxy, resolveNanimeInstance, unwrapNanimeProxies, type BufferedProxyReturns } from '../utils/create-proxy'
import { AnimationComponentFlags, getAnimationComponentFlag } from '../utils/normalizers/instance-management'
import { resolveKeepTime } from '../utils/global-options'

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

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * Reactive timeline composable. Returns a proxied `Timeline` whose
 * `.add()`, `.set()` and `.remove()` methods accept Vue template refs,
 * component refs and `MaybeRefOrGetter` targets alongside raw selectors.
 *
 * Calls made before mount are buffered and replayed once the DOM is ready,
 * so every method is safe to invoke immediately.
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

  const buildTimeline = (params: TimelineParams) => createTimeline(params)
  const createReplacement = keepsTime ? keepTime(buildTimeline) : buildTimeline

  const rebuildTimeline = (params: TimelineParams) => {
    if (!keepsTime && timeline.value) timeline.value.revert()
    timeline.value = createReplacement(params)
    flushBuffer()
  }

  if (flag === AnimationComponentFlags.Watchable) {
    watch(
      [mounted, resolveParameters],
      ([isMounted, params]) => {
        if (!isMounted) return
        rebuildTimeline(params)
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
