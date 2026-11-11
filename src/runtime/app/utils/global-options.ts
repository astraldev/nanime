import { hasInjectionContext, inject } from 'vue'
import { PROVIDED_DEFAULTS, useNanimeConfig } from './config'
import type { NanimeRebuild } from '../public/types'

export function resolveRebuild(option?: NanimeRebuild, supportsKeepValue = false): NanimeRebuild {
  const provided = option === undefined && hasInjectionContext() ? inject(PROVIDED_DEFAULTS, null) : null
  const rebuild = option ?? provided?.value.rebuild ?? useNanimeConfig()().rebuild ?? 'restart'
  return rebuild === 'keepValue' && !supportsKeepValue ? 'restart' : rebuild
}
