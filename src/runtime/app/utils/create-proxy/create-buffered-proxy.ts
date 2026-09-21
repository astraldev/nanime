/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Ref } from 'vue'
import { unref, isRef } from 'vue'
import { NANIME_INSTANCE } from './binding'
import type { BufferedProxyReturns } from './types'

export interface BufferedProxyOptions {
  /** Methods that return `this` — buffered when instance is null, replayed on flush */
  chainableMethods: Set<string>
  /** Transform args before passing to the real method (e.g. normalize targets) */
  transformArgs?: (method: string, args: any[]) => any[]
  /** Methods whose calls are recorded and re-applied to every later instance */
  replayMethods?: Set<string>
}

/** createProxy, plus buffering of chainable calls until the instance exists. */
export function createBufferedProxy<T>(
  objectRef: Ref<T | null>,
  options: BufferedProxyOptions,
): { proxy: BufferedProxyReturns<T>, flushBuffer: () => void } {
  const { chainableMethods, transformArgs, replayMethods } = options
  const pending: Array<{ method: string, args: any[] }> = []
  const replayable: Array<{ method: string, args: any[] }> = []

  function applyMethod(instance: any, method: string, args: any[]) {
    const transformed = transformArgs ? transformArgs(method, args) : args
    const fn = instance[method]
    if (typeof fn === 'function') {
      fn.apply(instance, transformed)
    }
  }

  function record(method: string, args: any[]) {
    if (replayMethods?.has(method)) replayable.push({ method, args })
  }

  function flushBuffer() {
    const instance = objectRef.value
    if (!instance) return

    for (const entry of replayable) {
      applyMethod(instance, entry.method, entry.args)
    }
    for (const entry of pending) {
      applyMethod(instance, entry.method, entry.args)
      record(entry.method, entry.args)
    }
    pending.length = 0
  }

  const proxy = new Proxy({}, {
    get(_, p, receiver) {
      if (p === NANIME_INSTANCE) return objectRef
      if (typeof p === 'symbol') {
        if (!objectRef.value) return undefined
        return Reflect.get(objectRef.value, p)
      }

      // Chainable methods: buffer when null, intercept when live
      if (chainableMethods.has(p)) {
        return (...args: any[]) => {
          if (!objectRef.value) {
            pending.push({ method: p, args })
          }
          else {
            applyMethod(objectRef.value, p, args)
            record(p, args)
          }
          return receiver
        }
      }

      // Everything else: delegate to real instance
      if (!objectRef.value) return undefined
      const val = Reflect.get(objectRef.value, p)
      if (typeof val === 'function') return val.bind(objectRef.value)
      return unref(val)
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
      if (!objectRef.value) return false
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

  return { proxy: reactive(proxy) as BufferedProxyReturns<T>, flushBuffer }
}
