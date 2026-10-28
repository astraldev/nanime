import { existsSync } from 'node:fs'
import { defineNuxtModule, createResolver, addComponent, addImportsDir, addTypeTemplate, addVitePlugin } from '@nuxt/kit'
import { defu } from 'defu'
import type { NanimeAppConfig, NanimeReducedMotion, NanimeTrackTargetsOnly } from './runtime/app/public/types'

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
  /** Features that are not stable yet and may change in any release. */
  experimental: {
    /**
     * Makes `trackTargetsOnly` available on `<AnimeLayoutGroup>` and `useAnimeLayout`, which measure only the layout
     * targets, their ancestors and their siblings instead of every descendant. `'off'` hides the option from the
     * types and keeps the patched AnimeJS layout out of the bundle, `'opt-in'` lets a layout set it, and `'global'`
     * turns it on for every layout unless it sets `trackTargetsOnly: false`.
     * @default 'off'
     */
    trackTargetsOnly: NanimeTrackTargetsOnly
  }
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
    nanime?: NanimeAppConfig
  }
  interface AppConfigInput {
    nanime?: NanimeAppConfig
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
    experimental: { trackTargetsOnly: 'off' },
  },
  setup(_options, _nuxt) {
    const resolver = createResolver(import.meta.url)
    const trackTargetsOnly = _options.experimental.trackTargetsOnly

    if (trackTargetsOnly !== 'off') {
      if (!existsSync(resolver.resolve('./runtime/app/experimental/core/layout/layout.js'))) {
        throw new Error('[nanime] experimental.trackTargetsOnly needs the patched AnimeJS layout; run `pnpm patch:animejs` first.')
      }
      addTypeTemplate({
        filename: 'types/nanime-experimental.d.ts',
        getContents: () => [
          `import type { TrackTargetsOnlyOptions } from '${resolver.resolve('./runtime/app/public/types')}'`,
          '',
          'declare global {',
          '  interface NanimeExperimentalLayoutOptions extends TrackTargetsOnlyOptions {}',
          '}',
          '',
        ].join('\n'),
      })
    }

    addVitePlugin(() => ({
      name: '__features',
      config(config) {
        config.define ||= {}
        config.define.__NANIME_TRACK_TARGETS_ONLY__ = JSON.stringify(trackTargetsOnly)
      },
    }))

    addVitePlugin(() => ({
      name: '__optimize-deps',
      config(config) {
        config.optimizeDeps ||= {}
        config.optimizeDeps.include ||= []
        config.optimizeDeps.include.push(...ANIMEJS_ENTRIES.map(entry => `${__name} > ${entry}`))
      },
    }))

    _nuxt.options.runtimeConfig.public.nanime = defu(
      _nuxt.options.runtimeConfig.public.nanime,
      { keepTime: _options.keepTime, reducedMotion: _options.reducedMotion },
    )

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
