import { useRuntimeConfig } from '#imports'

/** Per-call option first, then the `nanime.keepTime` set in nuxt.config. */
export function resolveKeepTime(option?: boolean): boolean {
  if (option !== undefined) return option
  return useRuntimeConfig().public.nanime.keepTime
}
