/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Ref } from 'vue'
import { isRef } from 'vue'

/** Marks a nanime proxy and exposes the ref holding its anime.js instance. */
export const NANIME_INSTANCE = Symbol.for('nanime-instance')

/** Fallback marker for toReactive returns, which take no custom get trap. */
const nanimeRegistry = new WeakMap<object, Ref<any>>()

/** Marks a toReactive return so resolveNanimeInstance can unwrap it. */
export function markNanimeInstance<T>(proxy: object, instanceRef: Ref<T>): void {
  nanimeRegistry.set(proxy, instanceRef)
}

/** Unwraps a nanime proxy to its anime.js instance; passes anything else through. */
export function resolveNanimeInstance<T>(value: unknown): T {
  if (value && typeof value === 'object') {
    // createProxy / createBufferedProxy path
    if (NANIME_INSTANCE in value) {
      const inst = (value as any)[NANIME_INSTANCE]
      return (isRef(inst) ? inst.value : inst) as T
    }
    // toReactive path
    const ref = nanimeRegistry.get(value as object)
    if (ref) return ref.value
  }
  return value as T
}

/** True for any value a nanime composable returned, by either proxy strategy. */
export function isNanimeProxy(value: unknown): value is object {
  if (!value || typeof value !== 'object') return false
  return NANIME_INSTANCE in value || nanimeRegistry.has(value)
}

/** True when parameters carry an instance another composable owns. */
export function hasNanimeProxy(parameters: object): boolean {
  return Object.values(parameters).some(isNanimeProxy)
}

/** Unwraps nanime proxies in parameters, keyed off the marker so any key works. */
export function unwrapNanimeProxies<T extends object>(parameters: T): T {
  const entries = Object.entries(parameters)
  if (!entries.some(([, value]) => isNanimeProxy(value))) return parameters

  const unwrapped = entries.map(([key, value]) => [
    key,
    isNanimeProxy(value) ? resolveNanimeInstance(value) : value,
  ])
  return Object.fromEntries(unwrapped) as T
}
