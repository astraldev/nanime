import { describe, it, expect } from 'vitest'
import { normalizeDuration } from '../../../src/runtime/app/utils/transitions/normalizers/normalize-duration'
import { normalizeOffset } from '../../../src/runtime/app/utils/transitions/normalizers/normalize-offsets'
import { normalizeAxis } from '../../../src/runtime/app/utils/transitions/normalizers/normalize-axis'

describe('normalizeDuration', () => {
  it('should return default duration when undefined', () => {
    expect(normalizeDuration()).toEqual({ enter: 300, leave: 300 })
  })

  it('should handle number inputs', () => {
    expect(normalizeDuration(500)).toEqual({ enter: 500, leave: 500 })
  })

  it('should handle array inputs', () => {
    expect(normalizeDuration([300, 500])).toEqual({ enter: 300, leave: 500 })
  })

  it('should handle object inputs', () => {
    expect(normalizeDuration({ enter: 250, leave: 450 })).toEqual({ enter: 250, leave: 450 })
  })
})

describe('normalizeOffset', () => {
  it('should return default offset when undefined', () => {
    expect(normalizeOffset()).toEqual({ enter: 0, leave: 0 })
  })

  it('should handle number inputs', () => {
    expect(normalizeOffset(100)).toEqual({ enter: 100, leave: 100 })
    expect(normalizeOffset(0)).toEqual({ enter: 0, leave: 0 })
    expect(normalizeOffset(-50)).toEqual({ enter: -50, leave: -50 })
  })

  it('should preserve string offsets with units', () => {
    expect(normalizeOffset('100px')).toEqual({ enter: '100px', leave: '100px' })
    expect(normalizeOffset('50%')).toEqual({ enter: '50%', leave: '50%' })
    expect(normalizeOffset('-100px')).toEqual({ enter: '-100px', leave: '-100px' })
  })

  it('should handle array inputs', () => {
    expect(normalizeOffset([50, 100])).toEqual({ enter: 50, leave: 100 })
    expect(normalizeOffset(['50px', '-100%'])).toEqual({ enter: '50px', leave: '-100%' })
  })

  it('should handle object inputs', () => {
    expect(normalizeOffset({ enter: 75, leave: 125 })).toEqual({ enter: 75, leave: 125 })
    expect(normalizeOffset({ enter: '100px', leave: '-50%' })).toEqual({ enter: '100px', leave: '-50%' })
  })

  it('should throw error for invalid units', () => {
    expect(() => normalizeOffset('100em' as any)).toThrow('Invalid offset value: "100em"')
  })
})

describe('normalizeAxis', () => {
  it('should return default axis when undefined', () => {
    expect(normalizeAxis()).toEqual({ enter: 'y', leave: 'y' })
  })

  it('should handle string inputs', () => {
    expect(normalizeAxis('x')).toEqual({ enter: 'x', leave: 'x' })
    expect(normalizeAxis('y')).toEqual({ enter: 'y', leave: 'y' })
  })

  it('should handle array inputs', () => {
    expect(normalizeAxis(['x', 'y'])).toEqual({ enter: 'x', leave: 'y' })
    expect(normalizeAxis(['y', 'x'])).toEqual({ enter: 'y', leave: 'x' })
  })

  it('should handle object inputs', () => {
    expect(normalizeAxis({ enter: 'x', leave: 'y' })).toEqual({ enter: 'x', leave: 'y' })
    expect(normalizeAxis({ enter: 'y', leave: 'x' })).toEqual({ enter: 'y', leave: 'x' })
  })
})
