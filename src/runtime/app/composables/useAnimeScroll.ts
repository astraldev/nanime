import { shallowRef, toValue, watch, type MaybeRefOrGetter } from 'vue'
import { onScroll } from 'animejs/events'
import type { ScrollObserver, ScrollObserverParams } from 'animejs'
import { createBufferedProxy, type BufferedProxyReturns } from '../utils/proxy'
import { tryOnScopeDispose, useMounted } from '../utils/vue-helpers'

const CHAINABLE_METHODS = new Set(['link', 'refresh', 'revert'])

/**
 * Creates an Anime.js `onScroll()` observer once the component is mounted.
 * The observer is rebuilt when `parameters` change, and reverted when the
 * scope is disposed. Calls made before mount are buffered.
 */
export function useAnimeScroll(
  parameters?: MaybeRefOrGetter<ScrollObserverParams>,
): BufferedProxyReturns<ScrollObserver> {
  const mounted = useMounted()
  const observer = shallowRef<ScrollObserver | null>(null)

  const { proxy, flushBuffer } = createBufferedProxy<ScrollObserver>(observer, {
    chainableMethods: CHAINABLE_METHODS,
  })

  const resolveParameters = () => toValue(parameters) || {}

  const rebuildObserver = (params: ScrollObserverParams) => {
    observer.value?.revert()
    observer.value = onScroll(params)
    flushBuffer()
  }

  watch(
    [mounted, resolveParameters],
    ([isMounted, params]) => {
      if (!isMounted) return
      rebuildObserver(params)
    },
    { immediate: true },
  )

  tryOnScopeDispose(() => {
    observer.value?.revert()
    observer.value = null
  })

  return proxy
}
