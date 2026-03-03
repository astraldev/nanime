import { tryOnScopeDispose, useMounted } from '@vueuse/core'
import { nextTick, shallowRef, toValue, watch, watchPostEffect } from 'vue'
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
  params?: DraggableOptions,
): ProxyReturns<Draggable> {
  const mounted = useMounted()
  const dragController = shallowRef<Draggable | null>(null)

  let oldTarget: TargetsParam

  watch(
    [
      () => target,
      () => params?.trigger,
      () => params?.container,
      () => mounted.value,
    ],
    () => {
      if (!mounted.value) return
      const targets = normalizeAnimeTarget(target)
      if (oldTarget === targets) return
      if (dragController.value) dragController.value.revert()
      oldTarget = targets

      const trigger = normalizeLayoutTarget(toValue(params)?.trigger)
      const container = normalizeDraggableContainer(toValue(params)?.container)

      const resolveAxis = <T extends DraggableOptions['x'] | DraggableOptions['y']>(axis: T) => {
        if (!axis || typeof axis !== 'object') return axis
        return defu(axis, {
          snap: (d: Draggable) => normalizeReffable(axis.snap, d),
        })
      }

      const dragEngine = createDraggable(targets, {
        ...params,
        trigger: trigger || undefined,
        container: container || undefined,
        ...(() => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const acc: any = {}
          REFFABLE_PROPS.forEach((key) => {
            if (!params || !(key in params)) return
            acc[key] = (d: Draggable) => normalizeReffable(params[key], d)
          })
          return acc
        })(),
        x: resolveAxis(params?.x),
        y: resolveAxis(params?.y),
      })

      console.log('initializing')

      dragController.value = dragEngine
    }, {
      flush: 'post',
    })

  watchPostEffect(() => {
    if (!params || !dragController.value) return

    // Access all refable values to register them as dependencies
    REFFABLE_PROPS.forEach((key) => {
      if (key in params) toValue(params[key])
    })

    if (typeof params.x === 'object' && params.x !== null) {
      toValue((params.x).snap)
    }

    if (typeof params.y === 'object' && params.y !== null) {
      toValue((params.y).snap)
    }

    nextTick(() => dragController.value?.refresh())
  })

  tryOnScopeDispose(() => {
    dragController.value?.revert()
  })

  return createProxy(dragController)
}
