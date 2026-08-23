import { describe, it, expect } from 'vitest'
import { scrambleText } from '../../../src/runtime/app/utils/proxies/text'
import { morphTo, createMotionPath, createDrawable } from '../../../src/runtime/app/utils/proxies/svg'
import * as rootProxies from '../../../src/runtime/app/utils/proxies/index'

describe('Proxies', () => {
  describe('Text Proxies', () => {
    it('should export scrambleText function', () => {
      expect(typeof scrambleText).toBe('function')
    })
  })

  describe('SVG Proxies', () => {
    it('should export morphTo function', () => {
      expect(typeof morphTo).toBe('function')
    })

    it('should export createMotionPath function', () => {
      expect(typeof createMotionPath).toBe('function')
    })

    it('should export createDrawable function', () => {
      expect(typeof createDrawable).toBe('function')
    })
  })

  describe('Root Proxies Barrel', () => {
    it('should export all text and svg proxy helpers', () => {
      expect(typeof rootProxies.scrambleText).toBe('function')
      expect(typeof rootProxies.morphTo).toBe('function')
      expect(typeof rootProxies.createMotionPath).toBe('function')
      expect(typeof rootProxies.createDrawable).toBe('function')
    })
  })
})
