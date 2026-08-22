/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Ref, UnwrapNestedRefs } from 'vue'
import { unref, isRef, reactive } from 'vue'

/**
 * Symbol used to identify nanime proxy objects and retrieve
 * the underlying raw anime.js instance ref.
 * Accessible via proxy[NANIME_INSTANCE] on createProxy / createBufferedProxy returns.
 */
export const NANIME_INSTANCE = Symbol.for('nanime-instance')

/**
 * WeakMap registry for composables that return via `toReactive`
 * (Vue's reactive proxy) where we can't inject a custom get trap.
 */
const nanimeRegistry = new WeakMap<object, Ref<any>>()

/**
 * Registers a toReactive-based return value so that
 * `resolveNanimeInstance` can extract the raw anime.js instance.
 */
export function markNanimeInstance<T>(proxy: object, instanceRef: Ref<T>): void {
  nanimeRegistry.set(proxy, instanceRef)
}

/**
 * Extracts the raw anime.js instance from a nanime proxy,
 * or returns the value unchanged if it isn't a proxy.
 *
 * Checks the NANIME_INSTANCE symbol first (createProxy / createBufferedProxy),
 * then falls back to the WeakMap registry (toReactive-based composables).
 */
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

export type SafeFunctions<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any
    ? ((...args: Parameters<T[K]>) => ReturnType<T[K]>) | undefined
    : T[K]
}

export type ProxyReturns<T> = SafeFunctions<Exclude<UnwrapNestedRefs<T>, null | undefined>>

/**
 * Return type for `createBufferedProxy`. Methods stay callable because the
 * proxy always hands back a real function — buffered before the instance
 * exists, delegated once it does.
 */
export type BufferedProxyReturns<T> = Exclude<UnwrapNestedRefs<T>, null | undefined>

/**
 * Converts the object to a reactive version, and stubs null / undefined values
 */
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

export interface BufferedProxyOptions {
  /** Methods that return `this` — buffered when instance is null, replayed on flush */
  chainableMethods: Set<string>
  /** Transform args before passing to the real method (e.g. normalize targets) */
  transformArgs?: (method: string, args: any[]) => any[]
}

/**
 * Like `createProxy`, but with two additions:
 * 1. Chainable methods are buffered when the ref is null and replayed on flush.
 * 2. An optional `transformArgs` hook rewrites arguments before each call
 *    (used to normalize Vue ref targets into DOM targets).
 */
export function createBufferedProxy<T>(
  objectRef: Ref<T | null>,
  options: BufferedProxyOptions,
): { proxy: BufferedProxyReturns<T>, flushBuffer: () => void } {
  const { chainableMethods, transformArgs } = options
  const buffer: Array<{ method: string, args: any[] }> = []

  function applyMethod(instance: any, method: string, args: any[]) {
    const transformed = transformArgs ? transformArgs(method, args) : args
    const fn = instance[method]
    if (typeof fn === 'function') {
      fn.apply(instance, transformed)
    }
  }

  function flushBuffer() {
    if (!objectRef.value) return
    for (const entry of buffer) {
      applyMethod(objectRef.value, entry.method, entry.args)
    }
    buffer.length = 0
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
            buffer.push({ method: p, args })
          }
          else {
            applyMethod(objectRef.value, p, args)
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
