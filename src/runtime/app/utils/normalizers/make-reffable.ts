import { toValue, type MaybeRefOrGetter } from '#imports'

export type MaybeRefOrArgsGetter<T, Args> = MaybeRefOrGetter<T> | ((data: Args) => T)

export type MakeRefable<T, K extends keyof T, Args> = {
  [P in keyof T]?: P extends K ? MaybeRefOrArgsGetter<T[P], Args> : T[P]
}

export function normalizeReffable<T, Args>(
  value: MaybeRefOrArgsGetter<T, Args>,
  args?: Args,
): T {
  if (typeof value === 'function') {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    return (value as Function)(args)
  }
  return toValue(value as MaybeRefOrGetter<T>)
}
