import { describe, it, expect } from 'vitest'
import { shallowRef, ref, isReactive } from 'vue'
import { createProxy } from '../../../src/runtime/app/utils/create-proxy'

describe('createProxy', () => {
  it('should create a reactive proxy from an object ref', () => {
    const objectRef = shallowRef({ a: 1, b: 'test' })
    const proxy = createProxy(objectRef)

    expect(isReactive(proxy)).toBe(true)
    expect(proxy.a).toBe(1)
    expect(proxy.b).toBe('test')
  })

  it('should handle null initial ref', () => {
    const objectRef = shallowRef(null)
    const proxy = createProxy(objectRef)

    // @ts-expect-error - testing dynamic access
    expect(proxy.someProp).toBeUndefined()
  })

  it('should reflect ref updates', () => {
    const objectRef = shallowRef<{ a: number } | null>({ a: 1 })
    const proxy = createProxy(objectRef)

    expect(proxy.a).toBe(1)

    objectRef.value = { a: 2 }
    expect(proxy.a).toBe(2)

    objectRef.value = null
    expect(proxy.a).toBeUndefined()
  })

  it('should unref nested refs when accessing properties', () => {
    const nestedRef = ref(100)
    const objectRef = shallowRef({ nested: nestedRef })
    const proxy = createProxy(objectRef)

    // Should return value, not the Ref object
    expect(proxy.nested).toBe(100)
  })

  it('should allow setting properties on the underlying object', () => {
    const objectRef = shallowRef({ a: 1 })
    const proxy = createProxy(objectRef)

    proxy.a = 2
    expect(objectRef.value.a).toBe(2)
  })

  it('should update nested refs when setting values', () => {
    const nestedRef = ref(100)
    const objectRef = shallowRef({ nested: nestedRef })
    const proxy = createProxy(objectRef)

    proxy.nested = 200

    // Should update the ref value, not replace the ref
    expect(nestedRef.value).toBe(200)
    expect(proxy.nested).toBe(200)
  })

  it('should replace nested ref if setting a new ref', () => {
    const nestedRef = ref(100)
    const objectRef = shallowRef<{ nested: any }>({ nested: nestedRef })
    const proxy = createProxy(objectRef)

    const newRef = ref(300)
    proxy.nested = newRef

    expect(objectRef.value.nested).toBe(newRef)
    expect(proxy.nested).toBe(300)
  })

  it('should ignore operations when ref is null', () => {
    const objectRef = shallowRef<any>(null)
    const proxy = createProxy(objectRef)

    // Set should return true but do nothing
    proxy.a = 1
    expect(proxy.a).toBeUndefined()

    // Delete should return true but do nothing
    delete proxy.a
    expect(proxy.a).toBeUndefined()
  })

  it('should handle property deletion', () => {
    const objectRef = shallowRef<{ a?: number }>({ a: 1 })
    const proxy = createProxy(objectRef)

    delete proxy.a
    expect(objectRef.value.a).toBeUndefined()
    expect(proxy.a).toBeUndefined()
  })

  it('should handle "in" operator', () => {
    const objectRef = shallowRef({ a: 1 })
    const proxy = createProxy(objectRef)

    expect('a' in proxy).toBe(true)
    expect('b' in proxy).toBe(false)
  })

  it('should enumerable keys', () => {
    const objectRef = shallowRef({ a: 1, b: 2 })
    const proxy = createProxy(objectRef)

    expect(Object.keys(proxy)).toEqual(['a', 'b'])
  })

  it('should return default property descriptor', () => {
    const objectRef = shallowRef({ a: 1 })
    const proxy = createProxy(objectRef)

    // We mock getOwnPropertyDescriptor to always return { enumerable: true, configurable: true }
    // if objectRef.value exists
    const desc = Object.getOwnPropertyDescriptor(proxy, 'a')
    expect(desc).toMatchObject({
      enumerable: true,
      configurable: true,
    })
  })

  it('should handle methods on the proxy object', () => {
    let callCount = 0
    const objectRef = shallowRef({
      doSomething() {
        callCount++
        return 'done'
      },
    })
    const proxy = createProxy(objectRef)

    expect(proxy.doSomething?.()).toBe('done')
    expect(callCount).toBe(1)
  })

  it('should return undefined for methods when ref is null', () => {
    const objectRef = shallowRef<{ doSomething: () => void } | null>(null)
    const proxy = createProxy(objectRef)

    // Should return undefined (user must safely access)
    expect(proxy.doSomething).toBeUndefined()
  })
})
