import { tryOnScopeDispose, useMounted, warnOutsideComponent } from '../utils/vue-helpers'
import { nextTick, shallowRef, watch, watchPostEffect } from 'vue'
import { hasTargets, normalizeAnimeTarget, normalizeDraggableContainer, normalizeLayoutTarget, sameTargets, type DraggableTypes } from '../utils/targets'
import { trackTargetList } from '../utils/target-list'
import type { Draggable, DraggableAxisParam, DraggableParams } from 'animejs'
import { createDraggable } from 'animejs/draggable'
import { createBufferedProxy, type BufferedProxyReturns } from '../utils/proxy'
import { normalizeReffable, type MakeRefable } from '../utils/instance/make-reffable'
import type { Prettify } from '../utils/instance/prettify'
import { omitUndefined, useComposableDefaults } from '../utils/component-defaults'

const REFFABLE_PROPS = [
  'containerPadding',
  'containerFriction',
  'dragSpeed',
  'scrollSpeed',
  'scrollThreshold',
  'minVelocity',
  'maxVelocity',
  'velocityMultiplier',
  'snap',
] as const

type RefableProps = typeof REFFABLE_PROPS[number]

const CHAINABLE_METHODS = new Set([
  'disable', 'enable', 'reset', 'revert', 'stop',
  'setX', 'setY', 'scrollInView', 'animateInView',
])

const sameSources = (next: readonly unknown[], prev: readonly unknown[]) =>
  next.every((entry, index) => sameTargets(entry, prev[index]))

/** The options of `useDraggable()`: AnimeJS draggable params, where most values can also be refs. */
export type DraggableOptions = MakeRefable<Omit<DraggableParams, 'trigger' | 'container' | 'x' | 'y'> & {
  trigger?: DraggableTypes['trigger']
  container?: DraggableTypes['container']
  x?: boolean | Prettify<MakeRefable<DraggableAxisParam, 'snap', Draggable>>
  y?: boolean | Prettify<MakeRefable<DraggableAxisParam, 'snap', Draggable>>
}, RefableProps, Draggable>

/**
 * Makes `target` draggable with an Anime.js `createDraggable()` when the
 * component mounts and reverts it when the scope is disposed.
 *
 * When a ref in `options` or `container` changes, the draggable updates in
 * place and keeps its position. When `target` or `trigger` points to a new
 * element, it is rebuilt.
 * Methods called before mount run once the draggable exists.
 */
export function useDraggable(
  target: DraggableTypes['target'],
  options?: DraggableOptions,
): BufferedProxyReturns<Draggable> {
  warnOutsideComponent('useDraggable')
  const mounted = useMounted()
  const resolveDefaults = useComposableDefaults('draggable')
  const dragController = shallowRef<Draggable | null>(null)

  const { proxy, flushBuffer } = createBufferedProxy<Draggable>(dragController, {
    chainableMethods: CHAINABLE_METHODS,
  })

  let enabled = true
  let latestContainer: ReturnType<typeof normalizeDraggableContainer> = null
  const readContainer = (self: Draggable) => {
    const current = latestContainer
    return typeof current === 'function' ? current(self) : current ?? document.body
  }

  trackTargetList(target)
  watch(
    [
      mounted,
      () => normalizeAnimeTarget(target),
      () => normalizeLayoutTarget(options?.trigger),
      () => normalizeDraggableContainer(options?.container),
    ],
    ([isMounted, targets, trigger, container], previous) => {
      if (!isMounted) return
      latestContainer = container
      if (dragController.value && previous && sameSources([targets, trigger], previous.slice(1)) && Boolean(container) === Boolean(previous[3])) {
        if (!sameTargets(container, previous[3])) dragController.value.refresh()
        return
      }
      if (dragController.value) enabled = dragController.value.enabled
      dragController.value?.revert()
      dragController.value = null
      if (!hasTargets(targets)) return

      const resolveAxis = <T extends DraggableOptions['x'] | DraggableOptions['y']>(axis: T) => {
        if (!axis || typeof axis !== 'object' || axis.snap === undefined) return axis
        const snap = axis.snap
        return { ...axis, snap: (d: Draggable) => normalizeReffable(snap, d) }
      }

      const defaults = resolveDefaults()
      const dragEngine = createDraggable(targets, {
        ...defaults,
        ...omitUndefined(options ?? {}),
        trigger: trigger || undefined,
        container: container ? readContainer : undefined,
        ...(() => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const acc: any = {}
          REFFABLE_PROPS.forEach((key) => {
            if (!options || !(key in options)) return
            acc[key] = (d: Draggable) => normalizeReffable(options[key], d)
          })
          return acc
        })(),
        x: resolveAxis(options?.x ?? defaults?.x),
        y: resolveAxis(options?.y ?? defaults?.y),
      })

      if (!enabled) dragEngine.disable()
      dragController.value = dragEngine
      flushBuffer()
    }, {
      flush: 'post',
    })

  watchPostEffect(() => {
    const draggable = dragController.value
    if (!options || !draggable) return

    // Access all refable values to register them as dependencies
    REFFABLE_PROPS.forEach((key) => {
      if (key in options) normalizeReffable(options[key], draggable)
    })

    if (typeof options.x === 'object' && options.x !== null) {
      normalizeReffable(options.x.snap, draggable)
    }

    if (typeof options.y === 'object' && options.y !== null) {
      normalizeReffable(options.y.snap, draggable)
    }

    nextTick(() => dragController.value?.refresh())
  })

  tryOnScopeDispose(() => {
    dragController.value?.revert()
  })

  return proxy
}
