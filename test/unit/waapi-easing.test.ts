import { describe, expect, it, vi } from 'vitest'
import { eases, spring } from 'animejs/easings'
import { resolveEase } from '../../src/runtime/app/experimental/waapi-timeline/easing'

describe('resolveEase', () => {
  it('passes CSS easings through', () => {
    expect(resolveEase('ease-out').easing).toBe('ease-out')
    expect(resolveEase('linear(0, 0.4, 1)').easing).toBe('linear(0, 0.4, 1)')
    expect(resolveEase('steps(4, end)').easing).toBe('steps(4, end)')
    expect(resolveEase('cubic-bezier(0.4, 0, 0.2, 1)').easing).toBe('cubic-bezier(0.4, 0, 0.2, 1)')
  })

  it('converts AnimeJS names and parameterised eases', () => {
    expect(resolveEase('outQuad').easing).toMatch(/^linear\(/)
    expect(resolveEase('outBack(3)').easing).toMatch(/^linear\(/)
    expect(resolveEase('outElastic(1, .5)').easing).toMatch(/^linear\(/)
  })

  it('converts functions and springs', () => {
    expect(resolveEase(eases.outQuad).easing).toMatch(/^linear\(/)

    const resolved = resolveEase(spring({ stiffness: 120, damping: 12 }))
    expect(resolved.easing).toMatch(/^linear\(/)
    expect(resolved.duration).toBeGreaterThan(0)
  })

  it('converts the deprecated AnimeJS string forms', () => {
    expect(resolveEase('cubicBezier(0.4, 0, 0.2, 1)').easing).toMatch(/^linear\(/)
    expect(resolveEase('irregular(20, .8)').easing).toMatch(/^linear\(/)
  })

  it('warns and falls back for unknown names', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    expect(resolveEase('unknown-ease-name').easing).toBe('linear')
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('unknown ease'))
    warn.mockRestore()

    expect(resolveEase('none').easing).toBe('linear')
  })
})
