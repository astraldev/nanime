import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { normalizeSplitTextTarget } from '../../../src/runtime/app/utils/targets'
import SplitTextComponent from './split-text.vue'

describe('normalizeSplitTextTarget', () => {
  it('should handle null/undefined', () => {
    expect(normalizeSplitTextTarget(null)).toBeNull()
    expect(normalizeSplitTextTarget(undefined)).toBeNull()
  })

  it('should handle string target', () => {
    const target = '.test-target'
    expect(normalizeSplitTextTarget(target)).toBe(target)
  })

  it('should handle HTMLElement', async () => {
    const wrapper = await mountSuspended(SplitTextComponent)
    const element = wrapper.find('div').element as HTMLElement
    expect(normalizeSplitTextTarget(element)).toBe(element)
  })

  it('should handle Vue Component instance', async () => {
    const wrapper = await mountSuspended(SplitTextComponent)
    const normalized = normalizeSplitTextTarget(wrapper.vm)
    expect(normalized).toBe((wrapper.vm).$el)
  })
})
