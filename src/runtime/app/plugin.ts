import { defineNuxtPlugin, useAppConfig, useRuntimeConfig } from '#imports'
import type { Plugin } from '#app'

const plugin: Plugin = defineNuxtPlugin((nuxtApp) => {
  const appConfig = useAppConfig()
  const runtime = useRuntimeConfig().public.nanime

  nuxtApp.vueApp.provide(Symbol.for('nanime-config'), () => ({
    keepTime: appConfig.nanime?.keepTime ?? runtime.keepTime,
    reducedMotion: appConfig.nanime?.reducedMotion ?? runtime.reducedMotion,
    preset: appConfig.nanime?.preset,
    transitions: appConfig.nanime?.transitions,
    components: appConfig.nanime?.components,
    composables: appConfig.nanime?.composables,
  }))
})

export default plugin
