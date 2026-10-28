import { hasInjectionContext, inject } from 'vue'
import { PROVIDED_DEFAULTS, useNanimeConfig } from './config'

/** Per-call option first, then `provideAnimeDefaults()`, `nanime.keepTime` in app.config, then in nuxt.config. */
export function resolveKeepTime(option?: boolean): boolean {
  if (option !== undefined) return option
  const provided = hasInjectionContext() ? inject(PROVIDED_DEFAULTS, null) : null
  return provided?.value.keepTime ?? useNanimeConfig()().keepTime ?? false
}
