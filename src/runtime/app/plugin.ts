import { defineNuxtPlugin, useAppConfig, useRuntimeConfig } from '#imports'
import type { Plugin } from '#app'
import { NANIME_CONFIG } from './utils/config'

const plugin: Plugin = defineNuxtPlugin((nuxtApp) => {
  const appConfig = useAppConfig()
  const runtime = useRuntimeConfig().public.nanime

  nuxtApp.vueApp.provide(NANIME_CONFIG, () => ({
    keepTime: appConfig.nanime?.keepTime ?? runtime.keepTime,
    reducedMotion: appConfig.nanime?.reducedMotion ?? runtime.reducedMotion,
    preset: appConfig.nanime?.preset,
    transitions: appConfig.nanime?.transitions,
    components: appConfig.nanime?.components,
    composables: appConfig.nanime?.composables,
  }))
})

export default plugin
