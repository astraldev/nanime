import { hasInjectionContext, inject } from 'vue'
import { PROVIDED_DEFAULTS, useNanimeConfig } from './config'
import type { AnimationPreset } from './presets'

export function useActivePreset(): () => AnimationPreset | undefined {
  const provided = hasInjectionContext() ? inject(PROVIDED_DEFAULTS, null) : null
  const config = useNanimeConfig()
  return () => provided?.value.preset ?? config().preset
}
