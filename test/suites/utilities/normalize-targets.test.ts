import { ref } from 'vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, it, expect, beforeAll } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import TargetTemplates from './target-templates.vue'
import { normalizeAnimeTarget, normalizeWaapiAnimeTarget, normalizeLayoutTarget } from '../../../src/runtime/app/utils/normalize-targets'

describe('normalize-targets', () => {
  let wrapper: VueWrapper<InstanceType<typeof TargetTemplates>>
  let vm: InstanceType<typeof TargetTemplates>
  let singleElement: HTMLElement
  let multipleElements: HTMLElement[]
  let svgElement: SVGElement

  beforeAll(async () => {
    wrapper = await mountSuspended(TargetTemplates)
    vm = wrapper.vm
    singleElement = wrapper.find('.single-target').element as HTMLElement
    multipleElements = wrapper.findAll('.multiple-target').map(w => w.element as HTMLElement)
    svgElement = wrapper.find('svg').element as SVGElement
  })

  // Functions to test common behavior against
  const normalizers = [
    { name: 'normalizeWaapiAnimeTarget', fn: normalizeWaapiAnimeTarget },
    { name: 'normalizeAnimeTarget', fn: normalizeAnimeTarget },
  ]

  describe('Common Behavior', () => {
    normalizers.forEach(({ name, fn }) => {
      describe(name, () => {
        it('should return the element directly when passed an HTMLElement', () => {
          expect(fn(singleElement)).toBe(singleElement)
        })

        it('should return the element directly when passed an SVGElement', () => {
          expect(fn(svgElement)).toBe(svgElement)
        })

        it('should resolve the root element when passed a Vue Component instance', () => {
          expect(fn(wrapper.vm)).toBe(wrapper.element)
        })

        it('should return the selector string unmodified', () => {
          expect(fn('.single-target')).toBe('.single-target')
        })

        it('should resolve a Template Ref to its corresponding DOM element', () => {
          expect(fn(vm.sTarget)).toBe(singleElement)
        })

        it('should resolve a Reactive Ref to its value', () => {
          const elementRef = ref(singleElement)
          expect(fn(elementRef)).toBe(singleElement)
        })

        it('should return the array of elements unmodified', () => {
          expect(fn(multipleElements)).toEqual(multipleElements)
        })

        it('should flatten nested arrays of elements', () => {
          const nested = [singleElement, [multipleElements[0], multipleElements[1]]] as any[]
          expect(fn(nested)).toEqual([singleElement, multipleElements[0], multipleElements[1]])
        })

        it('should filter out nullish values from arrays', () => {
          const mixedArray = [singleElement, undefined, null, [multipleElements[0]]] as any[]
          const result = fn(mixedArray)
          expect(result).toContain(singleElement)
          expect(result).toContain(multipleElements[0])
          expect(result).not.toContain(null)
          expect(result).not.toContain(undefined)
        })
      })
    })
  })

  describe('normalizeAnimeTarget (Standard)', () => {
    it('should return an empty array (safe return) when the target is null or undefined', () => {
      expect(normalizeAnimeTarget(null)).toEqual([])
      expect(normalizeAnimeTarget(undefined)).toEqual([])
    })

    it('should allow plain objects as targets (for non-DOM animation)', () => {
      const plainObj = { x: 0, y: 0 }
      expect(normalizeAnimeTarget(plainObj)).toBe(plainObj)
    })
  })

  describe('normalizeWaapiAnimeTarget (WAAPI)', () => {
    it('should return null when the target is null or undefined', () => {
      expect(normalizeWaapiAnimeTarget(null as any)).toBeNull()
      expect(normalizeWaapiAnimeTarget(undefined as any)).toBeNull()
    })
  })

  describe('normalizeLayoutTarget (Layout)', () => {
    it('should return the element directly when passed an HTMLElement', () => {
      expect(normalizeLayoutTarget(singleElement)).toBe(singleElement)
    })

    it('should resolve the root element when passed a Vue Component instance', () => {
      expect(normalizeLayoutTarget(wrapper.vm)).toBe(wrapper.element)
    })

    it('should return the selector string unmodified', () => {
      expect(normalizeLayoutTarget('.single-target')).toBe('.single-target')
    })

    it('should resolve a Template Ref to its corresponding DOM element', () => {
      if (!vm.sTarget) return
      expect(normalizeLayoutTarget(vm.sTarget)).toBe(singleElement)
    })

    it('should resolve a Reactive Ref to its value', () => {
      const elementRef = ref(singleElement)
      expect(normalizeLayoutTarget(elementRef)).toBe(singleElement)
    })

    it('should return null when passed null or undefined', () => {
      expect(normalizeLayoutTarget(null)).toBeNull()
      expect(normalizeLayoutTarget(undefined)).toBeNull()
    })

    it('should resolve a Reactive Ref containing null to null', () => {
      const nullRef = ref(null)
      expect(normalizeLayoutTarget(nullRef as any)).toBeNull()
    })
  })
})
