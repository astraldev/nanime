import { defineNuxtModule, createResolver, addImportsDir, addComponentsDir, addVitePlugin } from '@nuxt/kit'

export interface ModuleOptions {
  /** Add composables for animejs */
  composables: boolean
  /** Add custom transition components */
  components: boolean
  /** Prefix for components */
  prefix: string
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
    prefix: 'A',
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
          'animejs', 'animejs/animatable',
          '@vueuse/core', 'animejs/animation',
          'animejs/utils', 'lodash-es', 'animejs/waapi',
          'tailwind-merge', 'animejs/layout', 'animejs/text',
        )
      },
    }))

    if (_options.components) {
      addComponentsDir({
        prefix: _options.prefix,
        path: resolver.resolve('./runtime/app/components'),
        global: true,
      })
    }

    if (_options.composables) {
      addImportsDir(resolver.resolve('./runtime/app/composables'))
    }

    _nuxt.options.alias[`#${__configKey}`] = resolver.resolve('./runtime/app/composables')
    _nuxt.options.alias[`#${__configKey}/components`] = resolver.resolve('./runtime/app/components')
    _nuxt.options.alias[`#${__configKey}/utils`] = resolver.resolve('./runtime/app/utils/index')
    _nuxt.options.alias[`#${__configKey}/easings`] = resolver.resolve('./runtime/app/utils/easings')
  },
})
