import { tryOnScopeDispose, useMounted } from '@vueuse/core'
import { nextTick, shallowRef, toValue, watch, watchPostEffect, type MaybeRefOrGetter } from '#imports'
import { normalizeAnimeTarget, normalizeDraggableContainer, normalizeLayoutTarget, type DraggableTypes } from '../utils/normalize-targets'
import type { Draggable, DraggableAxisParam, DraggableParams, TargetsParam } from 'animejs'
import { createDraggable } from 'animejs/draggable'
import { createProxy, type ProxyReturns } from '../utils/create-proxy'
import { normalizeReffable, type MakeRefable } from '../utils/normalizers/make-reffable'
import type { Prettify } from '../utils/normalizers/prettify'
import defu from 'defu'

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

type DraggableOptions = MakeRefable<Omit<DraggableParams, 'trigger' | 'container' | 'x' | 'y'> & {
  trigger?: DraggableTypes['trigger']
  container?: DraggableTypes['container']
  x?: boolean | Prettify<MakeRefable<DraggableAxisParam, 'snap', Draggable>>
  y?: boolean | Prettify<MakeRefable<DraggableAxisParam, 'snap', Draggable>>
}, RefableProps, Draggable>

export function useDraggable(
  target: DraggableTypes['target'],
  options?: DraggableOptions,
): ProxyReturns<Draggable> {
  const mounted = useMounted()
  const dragController = shallowRef<Draggable | null>(null)

  let oldTarget: TargetsParam

  watch(
    [
      () => target,
      () => options?.trigger,
      () => options?.container,
      () => mounted.value,
    ],
    () => {
      if (!mounted.value) return
      const targets = normalizeAnimeTarget(target)
      if (oldTarget === targets) return
      if (dragController.value) dragController.value.revert()
      oldTarget = targets

      const trigger = normalizeLayoutTarget(toValue(options)?.trigger)
      const container = normalizeDraggableContainer(toValue(options)?.container)

      const resolveAxis = <T extends DraggableOptions['x'] | DraggableOptions['y']>(axis: T) => {
        if (!axis || typeof axis !== 'object') return axis
        return defu(axis, {
          snap: (d: Draggable) => normalizeReffable(axis.snap, d),
        })
      }

      const dragEngine = createDraggable(targets, {
        ...options,
        trigger: trigger || undefined,
        container: container || undefined,
        ...(() => {
          const acc: any = {}
          REFFABLE_PROPS.forEach((key) => {
            if (!options || !(key in options)) return
            acc[key] = (d: Draggable) => normalizeReffable(options[key], d)
          })
          return acc
        })(),
        x: resolveAxis(options?.x),
        y: resolveAxis(options?.y),
      })

      console.log('initializing')

      dragController.value = dragEngine
    }, {
      flush: 'post',
    })

  watchPostEffect(() => {
    if (!options || !dragController.value) return

    // Access all refable values to register them as dependencies
    REFFABLE_PROPS.forEach((key) => {
      if (key in options) toValue(options[key])
    })

    if (typeof options.x === 'object' && options.x !== null) {
      toValue((options.x).snap)
    }

    if (typeof options.y === 'object' && options.y !== null) {
      toValue((options.y).snap)
    }

    nextTick(() => dragController.value?.refresh())
  })

  tryOnScopeDispose(() => {
    dragController.value?.revert()
  })

  return createProxy(dragController)
}
