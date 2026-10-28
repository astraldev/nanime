import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { useAppConfig } from '#imports'
import { useComponentDefaults } from '../../../src/runtime/app/utils/component-defaults'
import { provideAnimeDefaults } from '../../../src/runtime/app/composables/provideAnimeDefaults'
import type { AnimeLayoutGroupProps, AnimeTransitionGroupProps, AnimeTransitionProps, NanimeComponentDefaults } from '../../../src/runtime/app/public/types'

let resolved: NanimeComponentDefaults = {}
let groupProps: NonNullable<NanimeComponentDefaults['transitionGroup']> = {}
let resolvedAnimation: ReturnType<ReturnType<typeof useComponentDefaults>['parseAnimation']> = {}

const noTransitionProps: AnimeTransitionProps = {}
const noGroupProps: AnimeTransitionGroupProps = {}
const noLayoutProps: AnimeLayoutGroupProps = {}

const Probe = defineComponent(() => {
  const transition = useComponentDefaults('transition')
  const transitionGroup = useComponentDefaults('transitionGroup')
  const layoutGroup = useComponentDefaults('layoutGroup')
  resolved = {
    transition: {
      mode: transition.parseOption(noTransitionProps, 'mode'),
      appear: transition.parseOption(noTransitionProps, 'appear'),
      enterAnimation: transition.parseOption(noTransitionProps, 'enterAnimation'),
    },
    transitionGroup: {
      tag: transitionGroup.parseOption(noGroupProps, 'tag'),
      moveAnimation: transitionGroup.parseOption(noGroupProps, 'moveAnimation'),
    },
    layoutGroup: {
      shallow: layoutGroup.parseOption(noLayoutProps, 'shallow'),
      layoutOptions: layoutGroup.parseOption(noLayoutProps, 'layoutOptions'),
    },
  }
  resolvedAnimation = transitionGroup.parseAnimation(groupProps)
  return () => h('div')
})

const Provider = defineComponent(
  (props: { defaults: NanimeComponentDefaults }, { slots }) => {
    provideAnimeDefaults(() => props.defaults)
    return () => slots.default?.()
  },
  { props: ['defaults'] },
)

function mountWith(...layers: NanimeComponentDefaults[]) {
  const tree = layers.reduceRight(
    (child, defaults) => () => h(Provider, { defaults }, { default: child }),
    () => h(Probe),
  )
  return mountSuspended(defineComponent(() => tree))
}

describe('component defaults', () => {
  afterEach(() => {
    groupProps = {}
    const appConfig = useAppConfig()
    if (appConfig.nanime) appConfig.nanime.components = undefined
  })

  it('is empty without config or providers', async () => {
    await mountWith()
    expect(resolved).toEqual({ transition: {}, transitionGroup: {}, layoutGroup: {} })
  })

  it('reads app config', async () => {
    const appConfig = useAppConfig()
    appConfig.nanime = { ...appConfig.nanime, components: { transition: { mode: 'out-in', appear: true } } }
    await mountWith()
    expect(resolved.transition).toEqual({ mode: 'out-in', appear: true })
  })

  it('lets a provider override app config per prop', async () => {
    const appConfig = useAppConfig()
    appConfig.nanime = { ...appConfig.nanime, components: { transition: { mode: 'out-in', appear: true } } }
    await mountWith({ transition: { appear: false } })
    expect(resolved.transition).toEqual({ mode: 'out-in', appear: false })
  })

  it('replaces an outer provider entry for the same component as a whole', async () => {
    await mountWith(
      { transitionGroup: { tag: 'ul', moveAnimation: false } },
      { transitionGroup: { tag: 'ol' } },
    )
    expect(resolved.transitionGroup).toEqual({ tag: 'ol' })
  })

  it('keeps an outer provider entry for another component', async () => {
    await mountWith(
      { transitionGroup: { tag: 'ul' }, layoutGroup: { shallow: true } },
      { transitionGroup: { tag: 'ol' } },
    )
    expect(resolved.transitionGroup).toEqual({ tag: 'ol' })
    expect(resolved.layoutGroup).toEqual({ shallow: true })
  })

  it('keeps an outer provider entry when an inner call sets that component to undefined', async () => {
    await mountWith({ transition: { mode: 'out-in' } }, { transition: undefined })
    expect(resolved.transition).toEqual({ mode: 'out-in' })
  })

  it('lays the closest provider entry over app config, never over an outer provider', async () => {
    const appConfig = useAppConfig()
    appConfig.nanime = { ...appConfig.nanime, components: { transition: { appear: true } } }
    await mountWith({ transition: { mode: 'out-in' } }, { transition: { enterAnimation: 'scale' } })
    expect(resolved.transition).toEqual({ appear: true, enterAnimation: 'scale' })
  })

  it('falls back to app config, not the outer provider, for a prop set to undefined', async () => {
    const appConfig = useAppConfig()
    appConfig.nanime = { ...appConfig.nanime, components: { transition: { mode: 'in-out' } } }
    await mountWith({ transition: { mode: 'out-in' } }, { transition: { mode: undefined, appear: true } })
    expect(resolved.transition).toEqual({ mode: 'in-out', appear: true })
  })

  it('replaces layoutOptions from app config as a whole', async () => {
    const appConfig = useAppConfig()
    appConfig.nanime = { ...appConfig.nanime, components: { layoutGroup: { layoutOptions: { duration: 500, ease: 'out' } } } }
    await mountWith({ layoutGroup: { layoutOptions: { duration: 200 } } })
    expect(resolved.layoutGroup?.layoutOptions).toEqual({ duration: 200 })
  })

  it('replaces animation params instead of blending them', async () => {
    await mountWith(
      { transition: { enterAnimation: { opacity: [0, 1], duration: 300 } } },
      { transition: { enterAnimation: { scale: [0, 1] } } },
    )
    expect(resolved.transition?.enterAnimation).toEqual({ scale: [0, 1] })
  })

  it('keeps an outer default when a provider passes undefined', async () => {
    const appConfig = useAppConfig()
    appConfig.nanime = { ...appConfig.nanime, components: { transition: { enterAnimation: 'scale' } } }
    await mountWith({ transition: { enterAnimation: undefined, mode: 'out-in' } })
    expect(resolved.transition).toEqual({ enterAnimation: 'scale', mode: 'out-in' })
  })
})

describe('parseAnimation', () => {
  afterEach(() => {
    groupProps = {}
    const appConfig = useAppConfig()
    if (appConfig.nanime) appConfig.nanime.components = undefined
  })

  it('lets a prop animation beat a provided enterAnimation', async () => {
    groupProps = { animation: 'scale' }
    await mountWith({ transitionGroup: { enterAnimation: 'fade' } })
    expect(resolvedAnimation).toEqual({ enter: 'scale', leave: 'scale', move: 'scale' })
  })

  it('lets enterAnimation beat animation in the same source', async () => {
    await mountWith({ transitionGroup: { animation: 'scale', enterAnimation: 'fade' } })
    expect(resolvedAnimation).toEqual({ enter: 'fade', leave: 'scale', move: 'scale' })
  })

  it('leaves the parts a source does not set to the next source', async () => {
    const appConfig = useAppConfig()
    appConfig.nanime = { ...appConfig.nanime, components: { transitionGroup: { animation: 'scale' } } }
    groupProps = { animation: { enter: 'fade' }, moveAnimation: false }
    await mountWith()
    expect(resolvedAnimation).toEqual({ enter: 'fade', leave: 'scale', move: false })
  })

  it('does not let an outer provider animation fill the parts an inner entry leaves out', async () => {
    await mountWith({ transitionGroup: { animation: 'scale' } }, { transitionGroup: { enterAnimation: 'fade' } })
    expect(resolvedAnimation).toEqual({ enter: 'fade', leave: undefined, move: undefined })
  })

  it('keeps move false from a provider over an app config animation', async () => {
    const appConfig = useAppConfig()
    appConfig.nanime = { ...appConfig.nanime, components: { transitionGroup: { animation: 'scale' } } }
    await mountWith({ transitionGroup: { moveAnimation: false } })
    expect(resolvedAnimation).toEqual({ enter: 'scale', leave: 'scale', move: false })
  })
})
