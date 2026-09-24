import { defineNuxtModule, createResolver, addComponent, addImportsDir, addVitePlugin } from '@nuxt/kit'
import { defu } from 'defu'
import type { NanimeAppConfig } from './runtime/app/public/types'

export interface ModuleOptions {
  /** Add composables for animejs */
  composables: boolean
  /** Register `<AnimeTransition>` and `<AnimeTransitionGroup>` */
  /** Register `<AnimeTransition>` and `<AnimeTransitionGroup>` */
  components: boolean
  /**
   * Default for every composable's `keepTime` option. `true` carries the
   * playhead across rebuilds, so an animation continues instead of restarting
   * when its reactive inputs change. A composable's own third argument still
   * wins over this.
   */
  keepTime: boolean
}

declare module 'nuxt/schema' {
  interface NuxtConfig {
    nanime?: Partial<ModuleOptions>
  }
  interface NuxtOptions {
    nanime: ModuleOptions
  }
  interface PublicRuntimeConfig {
    nanime: { keepTime: boolean }
  }
  // CustomAppConfig types what useAppConfig() reads; AppConfigInput checks app.config.ts.
  interface CustomAppConfig {
    nanime?: NanimeAppConfig
  }
  interface AppConfigInput {
    nanime?: NanimeAppConfig
  }
}

const __name = 'nanime'
const __configKey = 'nanime'

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
  },
  setup(_options, _nuxt) {
    const resolver = createResolver(import.meta.url)

    addVitePlugin(() => ({
      name: '__optimize-deps',
      config(config) {
        // This runs before environment setup
        config.optimizeDeps ||= {}
        config.optimizeDeps.include ||= []
        config.optimizeDeps.include.push(
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
          'animejs/timer',
          'tailwind-merge',
          'lodash-es',
        )
      },
    }))

    _nuxt.options.runtimeConfig.public.nanime = defu(
      _nuxt.options.runtimeConfig.public.nanime,
      { keepTime: _options.keepTime },
    )

    if (_options.composables) {
      addImportsDir(resolver.resolve('./runtime/app/composables'))
    }

    if (_options.components) {
      for (const name of ['AnimeTransition', 'AnimeTransitionGroup']) {
        addComponent({ name, filePath: resolver.resolve(`./runtime/app/components/${name}`) })
      }
      _nuxt.options.css.push(resolver.resolve('./runtime/app/components/anime-transition.css'))
    }

    _nuxt.options.alias[`#${__configKey}/composables`] = resolver.resolve('./runtime/app/composables')
    _nuxt.options.alias[`#${__configKey}/types`] = resolver.resolve('./runtime/app/public/types')
    _nuxt.options.alias[`#${__configKey}/easings`] = resolver.resolve('./runtime/app/public/easings')
    _nuxt.options.alias[`#${__configKey}/utils`] = resolver.resolve('./runtime/app/public/utils')
    _nuxt.options.alias[`#${__configKey}/proxies/text`] = resolver.resolve('./runtime/app/public/proxies/text')
    _nuxt.options.alias[`#${__configKey}/proxies/svg`] = resolver.resolve('./runtime/app/public/proxies/svg')
    _nuxt.options.alias[`#${__configKey}/proxies`] = resolver.resolve('./runtime/app/public/proxies/index')
  },
})
