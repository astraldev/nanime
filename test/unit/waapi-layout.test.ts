import { describe, expect, it } from 'vitest'
import { layoutTimeline } from '../../src/runtime/app/experimental/waapi-timeline/layout'

const fn = () => {}

describe('layoutTimeline callbacks', () => {
  it('stores callback times and keeps the tween length', () => {
    const layout = layoutTimeline([
      { kind: 'point', name: 'open', at: 100 },
      { kind: 'tween', target: null, params: { at: 0, duration: 300, opacity: [0, 1] } },
      { kind: 'callback', fn, at: 'open+150' },
    ], { duration: 300, ease: 'linear' })

    expect(layout.callbacks).toEqual([{ fn, time: 250 }])
    expect(layout.length).toBe(300)
  })

  it('extends the timeline to a callback after the last tween', () => {
    const layout = layoutTimeline([
      { kind: 'tween', target: null, params: { at: 0, duration: 100, opacity: [0, 1] } },
      { kind: 'callback', fn, at: 500 },
    ], { duration: 300, ease: 'linear' })

    expect(layout.callbacks).toEqual([{ fn, time: 500 }])
    expect(layout.length).toBe(500)
  })

  it('converts AnimeJS eases before the animation is built', () => {
    const layout = layoutTimeline([
      { kind: 'tween', target: null, params: { at: 0, ease: 'outQuad', opacity: [0, 1] } },
    ], { duration: 300, ease: 'linear' })

    expect(layout.tweens[0]?.ease).toMatch(/^linear\(/)
  })

  it('does not use a callback as the previous tween', () => {
    const layout = layoutTimeline([
      { kind: 'tween', target: null, params: { at: 0, duration: 100, opacity: [0, 1] } },
      { kind: 'callback', fn, at: 500 },
      { kind: 'tween', target: null, params: { at: '<+100%', duration: 50, opacity: [0, 1] } },
    ], { duration: 300, ease: 'linear' })

    expect(layout.tweens[1]?.start).toBe(100)
  })
})
