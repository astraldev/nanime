import { describe, expect, it } from 'vitest'
import { resolveAt } from '../../src/runtime/app/experimental/waapi-timeline/position'

const context = {
  points: new Map([['open', { time: 120, duration: 200 }]]),
  previous: { start: 100, end: 300, duration: 200 },
}

describe('resolveAt', () => {
  it('resolves absolute times and points', () => {
    expect(resolveAt(undefined, context)).toBe(0)
    expect(resolveAt(450, context)).toBe(450)
    expect(resolveAt(-50, context)).toBe(-50)
    expect(resolveAt('open', context)).toBe(120)
  })

  it('resolves shifts from the previous start', () => {
    expect(resolveAt('<', context)).toBe(100)
    expect(resolveAt('<+50', context)).toBe(150)
    expect(resolveAt('<-50', context)).toBe(50)
    expect(resolveAt('<+150ms', context)).toBe(250)
    expect(resolveAt('<+0.2s', context)).toBe(300)
    expect(resolveAt('<+100%', context)).toBe(300)
  })

  it('resolves percentage shifts against the previous duration', () => {
    expect(resolveAt('<+20%', context)).toBe(140)
    expect(resolveAt('<-20%', context)).toBe(60)
  })

  it('adds multiple shifts, with an unsigned first term', () => {
    expect(resolveAt('open 50% + 150ms', context)).toBe(370)
    expect(resolveAt('open + 50% - 150ms', context)).toBe(70)
    expect(resolveAt('open 50%', context)).toBe(220)
    expect(resolveAt('open+50%+150ms', context)).toBe(370)
    expect(resolveAt('< + 20% + 150ms', context)).toBe(290)
    expect(resolveAt('<+100% + 150ms', context)).toBe(450)
  })

  it('shifts from a point by time or percentage', () => {
    expect(resolveAt('open+50', context)).toBe(170)
    expect(resolveAt('open-50', context)).toBe(70)
    expect(resolveAt('open+20%', context)).toBe(160)
    expect(resolveAt('open-20%', context)).toBe(80)
    expect(resolveAt('open + 1s', context)).toBe(1120)
    expect(resolveAt('open - 20%', context)).toBe(80)
  })

  it('starts shifts at zero without a previous tween', () => {
    const first = { points: new Map<string, never>(), previous: null }
    expect(resolveAt('<', first)).toBe(0)
    expect(resolveAt('<+50', first)).toBe(50)
    expect(resolveAt('<-50', first)).toBe(-50)
    expect(resolveAt('<+20%', first)).toBe(0)
  })

  it('throws on unknown points and absolute percentages', () => {
    expect(() => resolveAt('missing', context)).toThrow('unknown point')
    expect(() => resolveAt('20%', context)).toThrow('unknown point')
    expect(() => resolveAt('<20%', context)).toThrow('unknown point')
    expect(() => resolveAt('missing+20%', context)).toThrow('unknown point')
    expect(() => resolveAt('open 50% +', context)).toThrow('unknown point')
    expect(() => resolveAt('open50%', context)).toThrow('unknown point')
    expect(() => resolveAt('<20%', context)).toThrow('unknown point')
    expect(() => resolveAt(Number.NaN, context)).toThrow('finite number')
  })
})
