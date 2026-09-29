import { isNanimeProxy, resolveNanimeInstance } from './proxy'

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null) return false
  const prototype = Object.getPrototypeOf(value)
  return prototype === Object.prototype || prototype === null
}

function snapshotObject(object: object, alreadyVisited: WeakSet<object>): Record<string, unknown> {
  alreadyVisited.add(object)
  return Object.fromEntries(
    Object.entries(object).map(([key, nestedValue]) => [key, snapshotValue(nestedValue, alreadyVisited)]),
  )
}

function snapshotValue(value: unknown, alreadyVisited: WeakSet<object>): unknown {
  if (isNanimeProxy(value)) return resolveNanimeInstance(value)
  if (typeof value !== 'object' || value === null || alreadyVisited.has(value)) return value
  if (Array.isArray(value)) {
    alreadyVisited.add(value)
    return value.map(item => snapshotValue(item, alreadyVisited))
  }
  return isPlainObject(value) ? snapshotObject(value, alreadyVisited) : value
}

/**
 * Makes a plain copy of a composable's parameters, reading every value inside.
 *
 * Composables watch their parameters to know when to rebuild. Take:
 *
 *   const params = reactive({ x: 100 })
 *   useAnimate(box, params)
 *   params.x = 200
 *
 * The last line should rebuild the animation. Without this copy, two things
 * stop that:
 *
 * 1. The change is never seen. Vue only reacts to values the watcher reads,
 *    and watching `params` itself reads nothing inside it. Copying reads
 *    `params.x`, so Vue now reacts when it changes.
 * 2. The change looks like no change. Before rebuilding, the new parameters are
 *    compared with the previous ones to skip needless rebuilds. If "previous"
 *    were `params` itself, it would already hold 200 too. The copy still
 *    holds 100.
 *
 * A value from another nanime composable, such as `autoplay: useAnimeScroll()`,
 * is copied as the instance it holds right now. When that composable rebuilds,
 * the copy differs, so this one rebuilds too and picks up the new instance.
 */
export function snapshotParameters(parameters: object): Record<string, unknown> {
  return snapshotObject(parameters, new WeakSet())
}
