/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Ref } from 'vue'
import { unref, isRef, reactive } from 'vue'
import { NANIME_INSTANCE } from './binding'
import type { ProxyReturns } from './types'

/** Reactive view over a ref, stubbing reads while it holds null. */
export function createProxy<T = object | null>(
  objectRef: Ref<T>,
): ProxyReturns<T> {
  const proxy = new Proxy({}, {
    get(_, p, receiver) {
      if (p === NANIME_INSTANCE) return objectRef
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
      if (p === NANIME_INSTANCE) return true
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
