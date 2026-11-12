import { defineNuxtModule, createResolver, addComponent, addImportsDir, addPlugin, addVitePlugin, useLogger } from '@nuxt/kit'
import type { NuxtImportPresetSource } from '@nuxt/schema'
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
   * Auto-import names for nanime composables that VueUse also auto-imports
   * (`useAnimate`, `useDraggable`), so VueUse keeps the plain names. `true`
   * uses `useAnimeAnimate` and `useAnimeDraggable`; a map sets your own names.
   * Applies only when VueUse auto-imports are installed.
   * @default false
   */
  vueuseAliases: boolean | Partial<Record<VueUseClash, string>>
}

const VUEUSE_CLASHES = ['useAnimate', 'useDraggable'] as const
type VueUseClash = typeof VUEUSE_CLASHES[number]
const VUEUSE_ALIASES: Record<VueUseClash, string> = {
  useAnimate: 'useAnimeAnimate',
  useDraggable: 'useAnimeDraggable',
}

const VUEUSE_CLASH_NAMES: ReadonlySet<string> = new Set(VUEUSE_CLASHES)

function isVueUseClash(name: string): name is VueUseClash {
  return VUEUSE_CLASH_NAMES.has(name)
}

function findVueUseClashes(presets: (NuxtImportPresetSource | string)[]) {
  const found = new Map<VueUseClash, number>()
  const add = (from: string, name: string, priority = 1) => {
    if (!from.startsWith('@vueuse/') || !isVueUseClash(name)) return
    found.set(name, Math.max(found.get(name) ?? priority, priority))
  }
  const visit = (preset: NuxtImportPresetSource | string) => {
    if (typeof preset === 'string' || 'package' in preset) {
      const from = typeof preset === 'string' ? preset : preset.package
      for (const name of VUEUSE_CLASHES) add(from, name)
      return
    }
    for (const entry of preset.imports) {
      if (typeof entry === 'string') add(preset.from, entry, preset.priority)
      else if (Array.isArray(entry)) add(entry[2] ?? preset.from, entry[1] ?? entry[0], preset.priority)
      else if ('imports' in entry) visit(entry)
      else add(preset.from, entry.as ?? entry.name, entry.priority ?? preset.priority)
    }
  }
  presets.forEach(visit)
  return found
}

function listNames(names: string[]) {
  const quoted = names.map(name => `\`${name}\``)
  return quoted.length > 1 ? `${quoted.slice(0, -1).join(', ')} and ${quoted.at(-1)}` : quoted.join('')
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
    vueuseAliases: false,
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

      const aliases = _options.vueuseAliases === true ? VUEUSE_ALIASES : _options.vueuseAliases || {}
      let sources: (NuxtImportPresetSource | string)[] = []
      let warned = false
      _nuxt.hook('imports:sources', (presets: (NuxtImportPresetSource | string)[]) => {
        sources = presets
      })
      _nuxt.hook('imports:extend', (imports) => {
        const clashes = findVueUseClashes(sources)
        if (!clashes.size) return
        const kept: { name: VueUseClash, nanimeWins: boolean }[] = []
        for (const entry of imports) {
          if (!entry.from.startsWith(composablesDir) || !isVueUseClash(entry.name) || (entry.as ?? entry.name) !== entry.name) continue
          const vueusePriority = clashes.get(entry.name)
          if (vueusePriority === undefined) continue
          const alias = aliases[entry.name]
          if (alias) entry.as = alias
          else kept.push({ name: entry.name, nanimeWins: (entry.priority ?? 1) >= vueusePriority })
        }
        if (warned || !kept.length) return
        warned = true
        const nanimeNames = kept.filter(clash => clash.nanimeWins).map(clash => clash.name)
        const vueuseNames = kept.filter(clash => !clash.nanimeWins).map(clash => clash.name)
        const gets = [
          nanimeNames.length ? `nanime's ${listNames(nanimeNames)}` : '',
          vueuseNames.length ? `VueUse's ${listNames(vueuseNames)}` : '',
        ].filter(Boolean).join(' and ')
        const renames = kept.map(clash => `\`${clash.name}\` → \`${VUEUSE_ALIASES[clash.name]}\``).join(', ')
        useLogger(__name).warn(`VueUse also auto-imports ${listNames(kept.map(clash => clash.name))}. The app gets ${gets}. Set \`nanime.vueuseAliases: true\` to rename nanime's (${renames}) and give VueUse the plain names, or import the other one explicitly from \`@vueuse/core\` or \`#nanime/composables\`.`)
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
  },
})
