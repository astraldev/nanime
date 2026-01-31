import { ref } from 'vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, it, expect } from 'vitest'
import TargetTemplates from './target-templates.vue'
import { normalizeAnimeTarget, normalizeWaapiAnimeTarget } from '../../../src/runtime/app/utils/normalize-targets'

describe('normalize-targets', async () => {
  const wrapper = await mountSuspended(TargetTemplates)
  const vm = wrapper.vm

  const singleElement = wrapper.find('.single-target').element as HTMLElement
  const multipleElements = wrapper.findAll('.multiple-target').map(w => w.element as HTMLElement)
  const svgElement = wrapper.find('svg').element as SVGElement

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
})
