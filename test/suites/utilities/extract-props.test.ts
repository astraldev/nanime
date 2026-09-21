import { describe, it, expect } from 'vitest'
import { extractNonFunctionProperties, extractOnlyFunctionProperties, omitProperties } from '../../../src/runtime/app/utils/extract-props'

describe('omitProperties', () => {
  it('should drop the named keys, copying only own enumerable properties', () => {
    const obj: { a: number, b: number } = Object.assign(Object.create({ onProto: 9 }), { a: 1, b: 2 })
    Object.defineProperty(obj, 'hidden', { value: 3, enumerable: false })

    expect(omitProperties(obj, ['b'])).toEqual({ a: 1 })
    expect(omitProperties(obj, [])).toEqual({ a: 1, b: 2 })
  })
})

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

  it('should extract bound prototype methods of a class instance', () => {
    class Base {
      html = '<p>hi</p>'
      split() { return this.html }
      revert() { return 'base' }
      // shares a name with Object.prototype, so it must not be treated as already seen
      toString() { return 'base' }
    }
    class Child extends Base {
      override revert() { return 'child' }
    }

    const result = extractOnlyFunctionProperties(new Child())
    expect(Object.keys(result).sort()).toEqual(['revert', 'split', 'toString'])
    expect(result.split()).toBe('<p>hi</p>')
    expect(result.revert()).toBe('child')
  })
})
