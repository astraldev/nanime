export function omitProperties<T extends object, K extends keyof T>(
  obj: T,
  keys: readonly K[],
): Omit<T, K> {
  const skip = new Set<unknown>(keys)
  const kept = Object.entries(obj).filter(([key]) => !skip.has(key))

  return Object.fromEntries(kept) as Omit<T, K>
}

type NonFunctionKeys<T> = {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T]

export type NonFunctionProperties<T> = Pick<T, NonFunctionKeys<T>>

export function extractNonFunctionProperties<T extends object>(obj: T): NonFunctionProperties<T> {
  if (!obj || typeof obj !== 'object') return {} as NonFunctionProperties<T>

  const result: Record<string, unknown> = {}
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key]
      if (typeof value !== 'function') {
        result[key] = value
      }
    }
  }
  return result as NonFunctionProperties<T>
}

type FunctionKeys<T> = {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T]

export type OnlyFunctionProperties<T> = Pick<T, FunctionKeys<T>>

export function extractOnlyFunctionProperties<T extends object>(obj: T): OnlyFunctionProperties<T> {
  if (!obj || typeof obj !== 'object') return {} as OnlyFunctionProperties<T>

  const result: Record<string, unknown> = {}
  let proto: object | null = obj

  while (proto && proto !== Object.prototype) {
    for (const key of Object.getOwnPropertyNames(proto)) {
      if (key === 'constructor' || Object.hasOwn(result, key)) {
        continue
      }

      const descriptor = Object.getOwnPropertyDescriptor(proto, key)
      const value: unknown = descriptor?.value

      if (typeof value === 'function') {
        result[key] = value.bind(obj)
      }
    }
    proto = Object.getPrototypeOf(proto) as object | null
  }
  return result as OnlyFunctionProperties<T>
}
