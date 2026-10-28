import { nextTick, onMounted, shallowRef, toValue, watch, type MaybeRef, type MaybeRefOrGetter } from 'vue'
import { createLayout, type AutoLayout, type AutoLayoutParams, type LayoutAnimationParams } from 'animejs/layout'
import type { DOMTargetSelector } from 'animejs'
import { loadPatchedLayout, resolveTrackTargetsOnly } from '../experimental/track-targets-only'
import type { AnimeLayoutParams, TrackTargetsOnlyOptions } from '../public/types'
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
   * Records the current layout, runs `callback`, waits for Vue to update the
   * DOM, then animates to the new layout. Resolves when the animation
   * finishes or a later `record()` or `patch()` interrupts it. A call made while another is still waiting for the DOM
   * update runs its callback and joins that animation.
   */
  patch: (callback: () => unknown, params?: LayoutAnimationParams) => Promise<void>
}

const interrupted = new WeakMap<AutoLayout, () => void>()

function animateUntilSettled(layout: AutoLayout | null, params?: LayoutAnimationParams) {
  return new Promise<void>((resolve) => {
    if (!layout) return resolve()
    interrupted.set(layout, resolve)
    const timeline = layout.animate(params)
    if (timeline.cancelled) return resolve()
    void timeline.then(() => resolve())
  })
}

function createNanimeLayout(base: AutoLayout, trackTargetsOnly: boolean, current: () => AutoLayout | null): NanimeLayout {
  const layout = markLayoutAnimations(base, trackTargetsOnly)
  const record = layout.record.bind(layout)
  layout.record = () => {
    record()
    interrupted.get(layout)?.()
    interrupted.delete(layout)
    return layout
  }
  let pending: Promise<void> | null = null
  return Object.assign(layout, {
    async patch(callback: () => unknown, animationParams?: LayoutAnimationParams) {
      if (pending) {
        const joined = pending
        await callback()
        return joined
      }
      current()?.record()
      const updated = (async () => {
        await callback()
        await nextTick()
      })()
      pending = updated.then(
        async () => {
          pending = null
          await animateUntilSettled(current(), animationParams)
        },
        (error: unknown) => {
          pending = null
          throw error
        },
      )
      return pending
    },
  })
}

/**
 * Animates position and size changes of the children of `target` with an
 * Anime.js `createLayout()`, created when the component mounts and reverted
 * when the scope is disposed.
 *
 * When `target` or `parameters` change, the layout is rebuilt. Methods
 * called before mount run once the layout exists.
 */
export function useAnimeLayout(
  target: MaybeRef<Parameters<typeof normalizeLayoutTarget>[0]>,
  parameters?: MaybeRefOrGetter<AnimeLayoutParams>,
): BufferedProxyReturns<NanimeLayout> {
  const mounted = useMounted()
  const layout = shallowRef<NanimeLayout | null>(null)

  const { proxy, flushBuffer } = createBufferedProxy<NanimeLayout>(layout, {
    chainableMethods: new Set(['record']),
  })

  const resolveRoot = () => normalizeLayoutTarget(toValue(target))
  const resolveParameters = (): AutoLayoutParams & TrackTargetsOnlyOptions => toValue(parameters) || {}

  let generation = 0

  const attach = (base: AutoLayout, trackTargetsOnly: boolean) => {
    layout.value = createNanimeLayout(base, trackTargetsOnly, () => layout.value)
    flushBuffer()
  }

  const rebuildLayout = (root: DOMTargetSelector, params: AutoLayoutParams & TrackTargetsOnlyOptions) => {
    const build = ++generation
    const trackTargetsOnly = resolveTrackTargetsOnly(params.trackTargetsOnly)
    layout.value?.revert()
    layout.value = null
    const create = trackTargetsOnly ? loadPatchedLayout() : createLayout
    if (!(create instanceof Promise)) return attach(create(root, { ...params }), trackTargetsOnly)
    void create.then((createPatched) => {
      if (build === generation) attach(createPatched(root, { ...params }), true)
    })
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
    generation++
    layout.value?.revert()
    layout.value = null
  })

  return proxy
}
