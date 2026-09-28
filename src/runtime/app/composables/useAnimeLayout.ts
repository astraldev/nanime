import { nextTick, onMounted, shallowRef, toValue, watch, type MaybeRef, type MaybeRefOrGetter } from 'vue'
import { createLayout, type AutoLayout, type AutoLayoutParams, type LayoutAnimationParams } from 'animejs/layout'
import type { DOMTargetSelector } from 'animejs'
import { normalizeLayoutTarget } from '../utils/targets'
import { createBufferedProxy, type BufferedProxyReturns } from '../utils/proxy'
import { deepEqualWithSkip } from '../utils/deep-equal'
import { snapshotParameters } from '../utils/snapshot-parameters'
import { markLayoutAnimations } from '../utils/layout-animations'
import { SHARED_ANIME_JS_CALLBACKS } from '../utils/instance/shared-callbacks'
import { tryOnScopeDispose, useMounted } from '../utils/vue-helpers'

const callbacks = [...SHARED_ANIME_JS_CALLBACKS]

type NanimeLayout = AutoLayout & {
  /**
   * Records the layout, runs `callback`, waits for Vue to patch the DOM, then
   * animates. Resolves when the animation finishes.
   */
  patch: (callback: () => unknown, params?: LayoutAnimationParams) => Promise<void>
}

function createNanimeLayout(root: DOMTargetSelector, params: AutoLayoutParams, current: () => AutoLayout | null): NanimeLayout {
  const layout = markLayoutAnimations(createLayout(root, { ...params }))
  return Object.assign(layout, {
    async patch(callback: () => unknown, animationParams?: LayoutAnimationParams) {
      current()?.record()
      await callback()
      await nextTick()
      await current()?.animate(animationParams)
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
    layout.value = createNanimeLayout(root, params, () => layout.value)
    flushBuffer()
  }

  let previous: { root: DOMTargetSelector, snapshot: Record<string, unknown> } | null = null

  const sync = () => {
    const root = resolveRoot()
    if (!mounted.value || !root) return
    const params = resolveParameters()
    const snapshot = snapshotParameters(params)
    if (
      previous
      && previous.root === root
      && deepEqualWithSkip(previous.snapshot, snapshot, callbacks)
    ) return

    previous = { root, snapshot }
    rebuildLayout(root, params)
  }

  watch([resolveRoot, () => snapshotParameters(resolveParameters())], sync)
  onMounted(sync)

  tryOnScopeDispose(() => {
    layout.value?.revert()
    layout.value = null
  })

  return proxy
}
