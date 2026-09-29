import { shallowRef, unref, watch, type Ref } from 'vue'
import { onScroll } from 'animejs/events'
import type { ScrollObserver, TargetsParam } from 'animejs'
import type { AnimeScrollParams } from '../public/types'
import { createBufferedProxy, resolveNanimeInstance, type BufferedProxyReturns } from '../utils/proxy'
import { snapshotParameters } from '../utils/snapshot-parameters'
import { deepEqualWithSkip } from '../utils/deep-equal'
import { hasTargets, normalizeAnimeTarget } from '../utils/targets'
import { normalizeReffable } from '../utils/instance/make-reffable'
import { tryOnScopeDispose, useMounted } from '../utils/vue-helpers'

const CHAINABLE_METHODS = new Set(['link', 'refresh', 'revert'])

const LIVE_PARAMS = ['enter', 'leave', 'repeat', 'axis'] as const
const PARAMS_WATCHED_SEPARATELY = new Set<string>([...LIVE_PARAMS, 'target', 'container'])

type LiveParam<T> = T | Readonly<Ref<T>> | ((observer: ScrollObserver) => T)

interface ObserverElements {
  target: TargetsParam
  container: TargetsParam
}

const createLiveParamReader = <T>(
  fallback: LiveParam<T>,
  readCurrent: () => LiveParam<T> | undefined,
) => (observer: ScrollObserver): T => normalizeReffable(readCurrent() ?? fallback, observer)

/**
 * Creates an Anime.js `onScroll()` observer when the component mounts and
 * reverts it when the scope is disposed.
 *
 * When a ref passed as `enter`, `leave`, `repeat` or `axis` changes, the
 * observer updates in place. When `target` or `container` points to a new
 * element, or another field of a `reactive()` parameters object changes, it
 * is rebuilt. Methods called before mount run once the observer exists.
 */
export function useAnimeScroll(
  parameters: AnimeScrollParams = {},
): BufferedProxyReturns<ScrollObserver> {
  const mounted = useMounted()
  const observer = shallowRef<ScrollObserver | null>(null)

  const { proxy, flushBuffer } = createBufferedProxy<ScrollObserver>(observer, {
    chainableMethods: CHAINABLE_METHODS,
    replayMethods: new Set(['link']),
    transformArgs: (method, args) => method === 'link' ? args.map(arg => resolveNanimeInstance(arg)) : args,
  })

  const readRebuildInputs = () => ({
    target: normalizeAnimeTarget(parameters.target),
    container: normalizeAnimeTarget(parameters.container),
    definedLiveParams: LIVE_PARAMS.filter(name => parameters[name] !== undefined),
    otherParams: snapshotParameters(Object.fromEntries(
      Object.entries(parameters).filter(([name]) => !PARAMS_WATCHED_SEPARATELY.has(name)),
    )),
  })

  const readLiveParamValues = () =>
    snapshotParameters(Object.fromEntries(LIVE_PARAMS.map(name => [name, unref(parameters[name])])))

  const createObserver = ({ target, container }: ObserverElements) => {
    const { enter, leave, repeat, axis } = parameters
    observer.value?.revert()
    observer.value = onScroll({
      ...parameters,
      target: hasTargets(target) ? target : undefined,
      container: hasTargets(container) ? container : undefined,
      enter: enter === undefined ? undefined : createLiveParamReader(enter, () => parameters.enter),
      leave: leave === undefined ? undefined : createLiveParamReader(leave, () => parameters.leave),
      repeat: repeat === undefined ? undefined : createLiveParamReader(repeat, () => parameters.repeat),
      axis: axis === undefined ? undefined : createLiveParamReader(axis, () => parameters.axis),
    })
    flushBuffer()
  }

  watch(
    [mounted, readRebuildInputs],
    ([isMounted, inputs], previous) => {
      if (!isMounted) return
      const previousInputs = previous?.[1]
      if (observer.value && previousInputs && deepEqualWithSkip(previousInputs, inputs)) return
      createObserver(inputs)
    },
    { immediate: true },
  )

  watch(
    readLiveParamValues,
    (values, previousValues) => {
      const activeObserver = observer.value
      if (!activeObserver || deepEqualWithSkip(previousValues, values)) return
      if (activeObserver.reverted) createObserver(readRebuildInputs())
      else if (activeObserver.target) activeObserver.refresh()
    },
    { flush: 'post' },
  )

  tryOnScopeDispose(() => {
    observer.value?.revert()
    observer.value = null
  })

  return proxy
}
