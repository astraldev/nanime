import { nextTick, shallowRef, toValue, watch, type MaybeRef, type MaybeRefOrGetter } from 'vue'
import { createLayout, type AutoLayout, type AutoLayoutParams, type LayoutAnimationParams } from 'animejs/layout'
import type { DOMTargetSelector, Timeline } from 'animejs'
import { normalizeLayoutTarget } from '../utils/targets'
import { createBufferedProxy, type BufferedProxyReturns } from '../utils/proxy'
import { deepEqualWithSkip } from '../utils/deep-equal'
import { SHARED_ANIME_JS_CALLBACKS } from '../utils/instance/shared-callbacks'
import { tryOnScopeDispose, useMounted } from '../utils/vue-helpers'

const callbacks = [...SHARED_ANIME_JS_CALLBACKS]

type NanimeLayout = AutoLayout & {
  /**
   * Records the layout, runs `callback`, waits for Vue to patch the DOM, then
   * animates. Resolves with the Anime.js timeline of the animation.
   */
  patch: (callback: () => unknown, params?: LayoutAnimationParams) => Promise<Timeline>
}

function createNanimeLayout(root: DOMTargetSelector, params: AutoLayoutParams): NanimeLayout {
  const layout = createLayout(root, params)
  return Object.assign(layout, {
    async patch(callback: () => unknown, animationParams?: LayoutAnimationParams) {
      layout.record()
      await callback()
      await nextTick()
      return layout.animate(animationParams)
    },
  })
}

/**
 * Animates position and size changes of a container's children with Anime.js
 * `createLayout()`. The layout is rebuilt when `target` or `parameters` change,
 * and reverted when the scope is disposed. Calls made before mount are buffered.
 */
export function useAnimeLayout(
  target: MaybeRef<Parameters<typeof normalizeLayoutTarget>[0]>,
  parameters?: MaybeRefOrGetter<AutoLayoutParams>,
): BufferedProxyReturns<NanimeLayout> {
  const mounted = useMounted()
  const layout = shallowRef<NanimeLayout | null>(null)

  const { proxy, flushBuffer } = createBufferedProxy<NanimeLayout>(layout, {
    chainableMethods: new Set(['record']),
  })

  const resolveRoot = () => normalizeLayoutTarget(toValue(target))
  const resolveParameters = () => toValue(parameters) || {}

  const rebuildLayout = (root: DOMTargetSelector, params: AutoLayoutParams) => {
    layout.value?.revert()
    layout.value = createNanimeLayout(root, params)
    flushBuffer()
  }

  let previous: { root: DOMTargetSelector, params: AutoLayoutParams } | null = null

  watch(
    [mounted, resolveRoot, resolveParameters],
    ([isMounted, root, params]) => {
      if (!isMounted || !root) return
      if (
        previous
        && previous.root === root
        && deepEqualWithSkip(previous.params, params, callbacks)
      ) return

      previous = { root, params }
      rebuildLayout(root, params)
    },
    { immediate: true },
  )

  tryOnScopeDispose(() => {
    layout.value?.revert()
    layout.value = null
  })

  return proxy
}
