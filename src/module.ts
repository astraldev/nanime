import { defineNuxtModule, createResolver, addComponent, addImportsDir, addPlugin, addVitePlugin } from '@nuxt/kit'
import type { NanimeConfig, NanimeReducedMotion } from './runtime/app/public/types'

export interface ModuleOptions {
  /**
   * Auto-import the nanime composables. With `false`, import them from
   * `#nanime/composables`.
   * @default true
   */
  composables: boolean
  /**
   * Register `<AnimeTransition>`, `<AnimeTransitionGroup>` and
   * `<AnimeLayoutGroup>`.
   * @default true
   */
  components: boolean
  /**
   * Default `keepTime` for every composable. With `true`, an animation that a
   * reactive change rebuilds continues from its current playhead instead of
   * restarting. A composable's own `keepTime` option overrides it.
   * @default false
   */
  keepTime: boolean
  /**
   * When animations jump to their end state. `'system'` follows `prefers-reduced-motion`.
   * @default 'never'
   */
  reducedMotion: NanimeReducedMotion
}

declare module 'nuxt/schema' {
  interface NuxtConfig {
    nanime?: Partial<ModuleOptions>
  }
  interface NuxtOptions {
    nanime: ModuleOptions
  }
  interface PublicRuntimeConfig {
    nanime: { keepTime: boolean, reducedMotion: NanimeReducedMotion }
  }
  // CustomAppConfig types what useAppConfig() reads; AppConfigInput checks app.config.ts.
  interface CustomAppConfig {
    nanime?: NanimeConfig
  }
  interface AppConfigInput {
    nanime?: NanimeConfig
  }
}

const __name = 'nanime'
const __configKey = 'nanime'

const ANIMEJS_ENTRIES = [
  'animejs/animation',
  'animejs/animatable',
  'animejs/utils',
  'animejs/waapi',
  'animejs/layout',
  'animejs/text',
  'animejs/svg',
  'animejs/events',
  'animejs/draggable',
  'animejs/timeline',
  'animejs/easings',
  'animejs/engine',
  'animejs/timer',
]

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: __name,
    configKey: __configKey,
    compatibility: {
      nuxt: '>=3.13.5 <5.0.0',
    },
  },
  defaults: {
    composables: true,
    components: true,
    keepTime: false,
    reducedMotion: 'never',
  },
  setup(_options, _nuxt) {
    const resolver = createResolver(import.meta.url)

    addVitePlugin(() => ({
      name: '__optimize-deps',
      config(config) {
        config.optimizeDeps ||= {}
        config.optimizeDeps.include ||= []
        config.optimizeDeps.include.push(...ANIMEJS_ENTRIES.map(entry => `${__name} > ${entry}`))
      },
    }))

    const existing = _nuxt.options.runtimeConfig.public.nanime
    _nuxt.options.runtimeConfig.public.nanime = {
      keepTime: existing?.keepTime ?? _options.keepTime,
      reducedMotion: existing?.reducedMotion ?? _options.reducedMotion,
    }

    addPlugin(resolver.resolve('./runtime/app/plugin'))

    if (_options.composables) {
      addImportsDir(resolver.resolve('./runtime/app/composables'))
    }

    if (_options.components) {
      for (const name of ['AnimeTransition', 'AnimeTransitionGroup', 'AnimeLayoutGroup']) {
        addComponent({ name, filePath: resolver.resolve(`./runtime/app/components/${name}`) })
      }
    }

    _nuxt.options.alias[`#${__configKey}/composables`] = resolver.resolve('./runtime/app/public/composables')
    _nuxt.options.alias[`#${__configKey}/types`] = resolver.resolve('./runtime/app/public/types')
    _nuxt.options.alias[`#${__configKey}/easings`] = resolver.resolve('./runtime/app/public/easings')
    _nuxt.options.alias[`#${__configKey}/utils`] = resolver.resolve('./runtime/app/public/utils')
    _nuxt.options.alias[`#${__configKey}/proxies/text`] = resolver.resolve('./runtime/app/public/proxies/text')
    _nuxt.options.alias[`#${__configKey}/proxies/svg`] = resolver.resolve('./runtime/app/public/proxies/svg')
    _nuxt.options.alias[`#${__configKey}/proxies`] = resolver.resolve('./runtime/app/public/proxies/index')
  },
})
