import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { useAppConfig } from '#imports'
import { assignDefined, useComponentDefaults } from '../../../src/runtime/app/utils/component-defaults'
import { provideAnimeDefaults } from '../../../src/runtime/app/composables/provideAnimeDefaults'
import type { NanimeComponentDefaults } from '../../../src/runtime/app/public/types'

let resolved: NanimeComponentDefaults = {}

const Probe = defineComponent(() => {
  const transition = useComponentDefaults('transition').merged
  const transitionGroup = useComponentDefaults('transitionGroup').merged
  const layoutGroup = useComponentDefaults('layoutGroup').merged
  resolved = { transition: transition.value, transitionGroup: transitionGroup.value, layoutGroup: layoutGroup.value }
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

  it('merges nested providers per component', async () => {
    await mountWith(
      { transitionGroup: { tag: 'ul', moveAnimation: false }, layoutGroup: { shallow: true } },
      { transitionGroup: { tag: 'ol' } },
    )
    expect(resolved.transitionGroup).toEqual({ tag: 'ol', moveAnimation: false })
    expect(resolved.layoutGroup).toEqual({ shallow: true })
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

describe('assignDefined', () => {
  it('skips undefined values and missing sources', () => {
    expect(assignDefined<{ a?: number, b?: number }>({ a: 1 }, undefined, { a: undefined, b: 2 })).toEqual({ a: 1, b: 2 })
  })
})
