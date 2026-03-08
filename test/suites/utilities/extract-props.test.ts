import { describe, it, expect } from 'vitest'
import { extractNonFunctionProperties, extractOnlyFunctionProperties } from '../../../src/runtime/app/utils/extract-props'

describe('extractNonFunctionProperties', () => {
  it('should extract only non-function properties', () => {
    const obj = {
      a: 1,
      b: 'string',
      c: true,
      d: () => { },
      e: function () { },
      f: { nested: 1 },
    }
    const result = extractNonFunctionProperties(obj)
    expect(result).toEqual({
      a: 1,
      b: 'string',
      c: true,
      f: { nested: 1 },
    })
  })

  it('should handle empty object', () => {
    expect(extractNonFunctionProperties({})).toEqual({})
  })

  it('should handle object with only functions', () => {
    const obj = {
      a: () => { },
      b: () => { },
    }
    expect(extractNonFunctionProperties(obj)).toEqual({})
  })
})

describe('extractOnlyFunctionProperties', () => {
  it('should extract only function properties', () => {
    const obj = {
      a: 1,
      b: 'string',
      c: true,
      d: () => { },
      e: function () { },
      f: { nested: 1 },
    }
    const result = extractOnlyFunctionProperties(obj)
    expect(result).toHaveProperty('d')
    expect(result).toHaveProperty('e')
    expect(typeof result.d).toBe('function')
    expect(typeof result.e).toBe('function')
    expect(result).not.toHaveProperty('a')
    expect(result).not.toHaveProperty('b')
    expect(result).not.toHaveProperty('c')
    expect(result).not.toHaveProperty('f')
  })

  it('should handle empty object', () => {
    expect(extractOnlyFunctionProperties({})).toEqual({})
  })

  it('should handle object with no functions', () => {
    const obj = {
      a: 1,
      b: 2,
    }
    expect(extractOnlyFunctionProperties(obj)).toEqual({})
  })
})
