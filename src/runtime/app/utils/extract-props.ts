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
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key]
      if (typeof value === 'function') {
        result[key] = value
      }
    }
  }
  return result as OnlyFunctionProperties<T>
}
