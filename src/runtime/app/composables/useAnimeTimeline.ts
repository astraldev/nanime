import { tryOnScopeDispose, useMounted } from '../utils/vue-helpers'
import { shallowRef, toValue, watch, nextTick, type MaybeRefOrGetter } from 'vue'
import type { TimelineParams } from 'animejs'
import { createTimeline, type Timeline } from 'animejs/timeline'
import { normalizeAnimeTarget } from '../utils/normalize-targets'
import { createBufferedProxy, resolveNanimeInstance, type BufferedProxyReturns } from '../utils/create-proxy'
import { AnimationComponentFlags, getAnimationComponentFlag } from '../utils/normalizers/instance-management'

const CHAINABLE_METHODS = new Set([
  // Timeline
  'add', 'set', 'remove', 'call', 'label', 'sync',
  'stretch', 'refresh', 'revert',

  // Timer controls
  'play', 'pause', 'resume', 'restart', 'reset',
  'reverse', 'alternate', 'seek', 'cancel',
  'complete', 'init', 'resetTime',
])
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
): BufferedProxyReturns<Timeline> {
  const flag = getAnimationComponentFlag()
  const mounted = useMounted()
  const timeline = shallowRef<Timeline | null>(null)

  const { proxy, flushBuffer } = createBufferedProxy<Timeline>(timeline, {
    chainableMethods: CHAINABLE_METHODS,
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

  if (flag === AnimationComponentFlags.Watchable) {
    watch(
      [mounted, () => toValue(parameters)],
      () => {
        if (!mounted.value) return
        if (timeline.value) timeline.value.revert()
        timeline.value = createTimeline(toValue(parameters) || {})
        flushBuffer()
      },
    )
  }
  else {
    nextTick(() => {
      timeline.value = createTimeline(toValue(parameters) || {})
      flushBuffer()
    })
  }

  tryOnScopeDispose(() => {
    timeline.value?.revert()
  })

  return proxy
}
