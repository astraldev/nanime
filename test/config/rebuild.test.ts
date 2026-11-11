import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import Rebuild from './rebuild.vue'

type Options = InstanceType<typeof Rebuild>['$props']['options']

async function rebuildAndRead(options?: Options) {
  const wrapper = await mountSuspended(Rebuild, { props: { options } })
  await wrapper.get('button').trigger('click')
  await flushPromises()
  return {
    progress: Number(wrapper.get('[data-test=progress]').text()),
    value: Number(wrapper.get('[data-test=value]').text()),
  }
}

describe('rebuild', () => {
  it('restarts the playhead when nuxt.config sets rebuild to restart', async () => {
    expect((await rebuildAndRead()).progress).toBe(0)
  })

  it('lets a per-call option override the configured default', async () => {
    expect((await rebuildAndRead({ rebuild: 'keepTime' })).progress).toBeCloseTo(0.5, 2)
  })

  it('starts the rebuilt animation from the current value with keepValue', async () => {
    const { value } = await rebuildAndRead({ rebuild: 'keepValue' })
    expect(value).toBeCloseTo(50, 0)
  })
})
