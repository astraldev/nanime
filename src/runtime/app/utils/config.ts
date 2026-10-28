import { hasInjectionContext, inject, toValue, type App, type ComputedRef, type InjectionKey, type MaybeRefOrGetter } from 'vue'
import type { NanimeConfig, NanimeDefaults } from '../public/types'

export const PROVIDED_DEFAULTS: InjectionKey<ComputedRef<NanimeDefaults>> = Symbol('nanime-provided-defaults')
export const NANIME_CONFIG: InjectionKey<() => NanimeConfig> = Symbol('nanime-config')

export function configureNanime(app: App, config: MaybeRefOrGetter<NanimeConfig>) {
  app.provide(NANIME_CONFIG, () => toValue(config))
}

export function useNanimeConfig(): () => NanimeConfig {
  const root = hasInjectionContext() ? inject(NANIME_CONFIG, null) : null
  return () => root?.() ?? {}
}
