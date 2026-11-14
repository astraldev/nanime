import { describe, expect, it, vi } from 'vitest'
import { resolveEase } from '../../src/runtime/app/experimental/waapi-timeline/easing'

describe('resolveEase', () => {
  it('passes CSS easings through', () => {
    expect(resolveEase('ease-out').easing).toBe('ease-out')
    expect(resolveEase('linear(0, 0.4, 1)').easing).toBe('linear(0, 0.4, 1)')
    expect(resolveEase('steps(4, end)').easing).toBe('steps(4, end)')
    expect(resolveEase('cubic-bezier(0.4, 0, 0.2, 1)').easing).toBe('cubic-bezier(0.4, 0, 0.2, 1)')
  })

  it('warns and falls back for non-CSS names', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    expect(resolveEase('outQuad').easing).toBe('linear')
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('unknown ease'))
    warn.mockRestore()
  })
})
