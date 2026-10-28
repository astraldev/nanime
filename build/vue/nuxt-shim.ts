import type { NanimeAppConfig, NanimeReducedMotion } from '../../src/runtime/app/public/types'

export interface AppConfig {
  nanime?: NanimeAppConfig
}

interface RuntimeConfig {
  public: { nanime: { keepTime: boolean, reducedMotion: NanimeReducedMotion } }
}

export function useAppConfig(): AppConfig {
  return {}
}

export function useRuntimeConfig(): RuntimeConfig {
  return { public: { nanime: { keepTime: false, reducedMotion: 'never' } } }
}
