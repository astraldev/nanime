import { defineNuxtModule, createResolver, addComponent, addImportsDir, addPlugin, addVitePlugin, useLogger } from '@nuxt/kit'
import { isAbsolute, relative } from 'node:path'
import type * as NanimeComposables from './runtime/app/public/composables'
import type { NanimeConfig, NanimeRebuild, NanimeReducedMotion } from './runtime/app/public/types'

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
   * Default `rebuild` for `useAnimate`, `useAnimeTimeline` and `useScrambleText` when they do not set their own.
   * @default 'restart'
   */
  rebuild: NanimeRebuild
  /**
   * When animations jump to their end state. `'system'` follows `prefers-reduced-motion`.
   * @default 'never'
   */
  reducedMotion: NanimeReducedMotion
  /**
   * Renames `nanime` composables whose name another auto-import also uses,
   * such as `useDraggable` from `@vueuse/nuxt`. `true` turns `useDraggable`
   * into `useAnimeDraggable`. A string replaces `Anime`, so `'motion'` turns
   * it into `useMotionDraggable`. `{ useDraggable: 'useDrag' }` sets the name
   * directly. Composables without a clash keep their names. Has no effect
   * with `composables: false`.
   * @default false
   */
  aliases: boolean | string | Partial<Record<NanimeComposable, string>>
}

type NanimeComposable = keyof typeof NanimeComposables

interface AutoImport {
  name: string
  as?: string
  from: string
  priority?: number
  type?: boolean
  disabled?: boolean
}

function withPrefix(name: string, prefix: string) {
  const word = prefix.charAt(0).toUpperCase() + prefix.slice(1)
  const verb = /^[a-z]+/.exec(name)?.[0] ?? ''
  return `${verb}${word}${name.slice(verb.length)}`
}

function aliasFor(name: string, aliases: ModuleOptions['aliases']) {
  if (aliases === true) return withPrefix(name, 'Anime')
  if (typeof aliases === 'string') return aliases ? withPrefix(name, aliases) : undefined
  if (!aliases) return undefined
  return Object.entries(aliases).find(([key]) => key === name)?.[1]
}

function isValueImport(entry: AutoImport) {
  return !entry.type && !entry.disabled
}

declare module 'nuxt/schema' {
  interface NuxtConfig {
    nanime?: Partial<ModuleOptions>
  }
  interface NuxtOptions {
    nanime: ModuleOptions
  }
  interface PublicRuntimeConfig {
    nanime: { rebuild: NanimeRebuild, reducedMotion: NanimeReducedMotion }
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
    rebuild: 'restart',
    reducedMotion: 'never',
    aliases: false,
  },
  setup(_options, _nuxt) {
    const resolver = createResolver(import.meta.url)

    if (Reflect.has(_options, 'keepTime')) {
      useLogger(__name).warn('`keepTime: true` is now `rebuild: \'keepTime\'`.')
    }

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
      rebuild: existing?.rebuild ?? _options.rebuild,
      reducedMotion: existing?.reducedMotion ?? _options.reducedMotion,
    }

    addPlugin(resolver.resolve('./runtime/app/plugin'))

    if (_options.composables) {
      const composablesDir = resolver.resolve('./runtime/app/composables')
      addImportsDir(composablesDir)

      const isNanime = (entry: AutoImport) => entry.from.startsWith(composablesDir)
      const label = (from: string) => isAbsolute(from) ? relative(_nuxt.options.rootDir, from) : from
      let warned = false

      _nuxt.hook('imports:context', (unimport) => {
        _nuxt.hook('imports:extend', async (imports) => {
          await unimport.getImports()
          const all: AutoImport[] = [...unimport.getInternalContext().staticImports, ...imports].filter(isValueImport)
          const lines: string[] = []
          for (const entry of imports) {
            if (!isNanime(entry) || !isValueImport(entry) || (entry.as ?? entry.name) !== entry.name) continue
            const sameName = all.filter(other => (other.as ?? other.name) === entry.name)
            const others = sameName.filter(other => !isNanime(other))
            if (!others.length) continue
            const alias = aliasFor(entry.name, _options.aliases)
            if (alias) {
              entry.as = alias
              continue
            }
            const winner = sameName.reduceRight((best, other) => (other.priority ?? 1) > (best.priority ?? 1) ? other : best)
            const sources = [...new Set(others.map(other => `\`${label(other.from)}\``))].join(', ')
            const gets = isNanime(winner) ? 'nanime\'s' : `\`${label(winner.from)}\`'s`
            lines.push(`  - \`${entry.name}\` is also auto-imported from ${sources}. The app gets ${gets}. \`aliases: true\` renames nanime's to \`${aliasFor(entry.name, true)}\`.`)
          }
          if (warned || !lines.length) return
          warned = true
          useLogger(__name).warn([
            'Other auto-imports use the same names as nanime composables:',
            ...lines,
            'Set `nanime.aliases` to rename them, or import the one you need explicitly.',
          ].join('\n'))
        })
      })
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
    _nuxt.options.alias[`#${__configKey}/experimental`] = resolver.resolve('./runtime/app/experimental/index')
  },
})
