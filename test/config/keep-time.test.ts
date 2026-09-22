import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import KeepTime from './keep-time.vue'

async function rebuildAndReadProgress(options?: { keepTime: boolean }) {
  const wrapper = await mountSuspended(KeepTime, { props: { options } })
  await wrapper.get('button').trigger('click')
  await flushPromises()
  return Number(wrapper.get('[data-test=progress]').text())
}

describe('keepTime', () => {
  it('restarts the playhead when nuxt.config sets keepTime false', async () => {
    expect(await rebuildAndReadProgress()).toBe(0)
  })

  it('lets a per-call option override the configured default', async () => {
    expect(await rebuildAndReadProgress({ keepTime: true })).toBeCloseTo(0.5, 2)
  })
})
