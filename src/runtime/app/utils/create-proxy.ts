import type { Ref, UnwrapNestedRefs } from 'vue'
import { unref, isRef, reactive } from '#imports'

export type SafeFunctions<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any
    ? ((...args: Parameters<T[K]>) => ReturnType<T[K]>) | undefined
    : T[K]
}

export type ProxyReturns<T> = SafeFunctions<Exclude<UnwrapNestedRefs<T>, null | undefined>>

/**
 * Converts the object to a reactive version, and stubs null / undefined values
 */
export function createProxy<T = object | null>(
  objectRef: Ref<T>,
): ProxyReturns<T> {
  const proxy = new Proxy({}, {
    get(_, p, receiver) {
      if (!objectRef.value) return undefined
      return unref(Reflect.get(objectRef.value, p, receiver))
    },
    set(_, p, value) {
      if (!objectRef.value) return true

      if (isRef((objectRef.value as any)[p]) && !isRef(value))
        (objectRef.value as any)[p].value = value
      else
        (objectRef.value as any)[p] = value
      return true
    },
    deleteProperty(_, p) {
      if (!objectRef.value) return true
      return Reflect.deleteProperty(objectRef.value, p)
    },
    has(_, p) {
      if (!objectRef.value) return true
      return Reflect.has(objectRef.value, p)
    },
    ownKeys() {
      if (!objectRef.value) return []
      return Object.keys(objectRef.value)
    },
    getOwnPropertyDescriptor() {
      if (!objectRef.value) return undefined
      return {
        enumerable: true,
        configurable: true,
      }
    },
  })

  return reactive(proxy) as ProxyReturns<T>
}
