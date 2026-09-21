/* eslint-disable @typescript-eslint/no-explicit-any */
import type { UnwrapNestedRefs } from 'vue'

export type SafeFunctions<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any
    ? ((...args: Parameters<T[K]>) => ReturnType<T[K]>) | undefined
    : T[K]
}

export type ProxyReturns<T> = SafeFunctions<Exclude<UnwrapNestedRefs<T>, null | undefined>>

/** createBufferedProxy's return; methods stay callable before the instance exists. */
export type BufferedProxyReturns<T> = Exclude<UnwrapNestedRefs<T>, null | undefined>
