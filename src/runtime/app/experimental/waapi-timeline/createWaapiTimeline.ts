import { buildTimeline } from './build'
import { layoutTimeline, type RegisteredEntry, type ResolvedCallback, type TimelineLayout } from './layout'
import type { WaapiTimeline, WaapiTimelineOptions, WaapiTimelineTarget } from './types'

type Status = 'idle' | 'running' | 'paused' | 'finished'

type Direction = 1 | -1

function resolveElements(target: WaapiTimelineTarget): Element[] {
  // a function target runs at build time, after the DOM exists
  const resolved = typeof target === 'function' ? target() : target
  if (resolved === null || resolved === undefined || resolved === '') return []

  if (typeof resolved === 'string') return Array.from(document.querySelectorAll(resolved))
  if (resolved instanceof Element) return [resolved]

  return Array.from(new Set(Array.from(resolved)))
}

/**
 * Creates a native Web Animations timeline.
 *
 * Register points and tweens with `point()` and `tween()`, then call
 * `play()`, `reverse()` or `seek()`. The browser owns the clock; no
 * JavaScript runs per frame.
 *
 * This factory has no framework lifecycle. Call `cancel()` when you are done.
 */
export function createWaapiTimeline(options: WaapiTimelineOptions = {}): WaapiTimeline {
  const reduce = options.isReducedMotion ?? (() => false)
  const defaults = {
    duration: options.defaults?.duration ?? 300,
    ease: options.defaults?.ease ?? 'linear',
  }
  const fill = options.fill ?? 'auto'
  const entries: RegisteredEntry[] = []

  // the active build; cancel() clears these so the next play rebuilds
  let layoutCache: TimelineLayout | null = null

  let animations: Animation[] = []
  let clock: Animation | null = null
  let length = 0
  let callbacks: ResolvedCallback[] = []
  let cursor = 0
  let frame = 0
  let built = false
  let frozen = false

  let status: Status = 'idle'
  let direction: Direction = 1

  function layout(): TimelineLayout {
    if (!layoutCache) layoutCache = layoutTimeline(entries, defaults)
    return layoutCache
  }

  function assertMutable(method: string): void {
    if (frozen) throw new Error(`createWaapiTimeline: ${method}() must be called before the first play().`)
  }

  function setStatus(next: Status): void {
    if (status === next) return
    status = next
    options.onRunningChange?.(next === 'running')
  }

  function build(): void {
    if (built) return
    if (typeof document === 'undefined' || typeof Animation === 'undefined' || typeof KeyframeEffect === 'undefined') return

    const current = layout()

    // targets resolve once, here, so buildTimeline only sees elements
    const result = buildTimeline({
      length: current.length,
      tweens: current.tweens.map(tween => ({
        elements: resolveElements(tween.target),
        tracks: tween.tracks,
        start: tween.start,
        duration: tween.duration,
        ease: tween.ease,
      })),
    }, fill)

    length = result.length
    animations = result.animations
    clock = result.clock
    callbacks = current.callbacks

    // the clock is the only animation that reports when the whole timeline ends
    clock.onfinish = () => {
      if (status !== 'running') return

      // flush callbacks before the final status, in case rAF stopped early
      const end = direction === 1 ? length : 0
      fireBetween(cursor, end, direction)
      cursor = end
      stopLoop()
      setStatus('finished')
    }

    // registrations freeze on the first build; cancel() keeps them
    built = true
    frozen = true
  }

  function applyRate(): void {
    for (const animation of animations) animation.playbackRate = direction
    if (clock) clock.playbackRate = direction
  }

  function pauseAll(): void {
    for (const animation of animations) animation.pause()
    clock?.pause()
  }

  function seekAll(time: number): void {
    for (const animation of animations) animation.currentTime = time
    if (clock) clock.currentTime = time
  }

  function playhead(): number {
    const time = clock?.currentTime
    return typeof time === 'number' ? time : 0
  }

  function fireBetween(from: number, to: number, next: Direction): void {
    if (!callbacks.length || from === to) return

    const crossed = callbacks.filter(callback => next === 1
      ? callback.time > from && callback.time <= to
      : callback.time < from && callback.time >= to)
    if (!crossed.length) return

    crossed.sort((a, b) => (a.time - b.time) * next)
    for (const callback of crossed) callback.fn()
  }

  function fireAll(next: Direction): void {
    if (!callbacks.length) return

    const all = [...callbacks].sort((a, b) => (a.time - b.time) * next)
    for (const callback of all) callback.fn()
  }

  function tick(): void {
    frame = 0
    const time = playhead()
    const previous = cursor
    cursor = time

    fireBetween(previous, time, direction)

    // a callback may have paused, seeked or restarted the timeline
    if (status === 'running' && !frame) frame = requestAnimationFrame(tick)
  }

  function startLoop(): void {
    if (frame || !callbacks.length || typeof requestAnimationFrame === 'undefined') return
    frame = requestAnimationFrame(tick)
  }

  function stopLoop(): void {
    if (!frame) return
    if (typeof cancelAnimationFrame !== 'undefined') cancelAnimationFrame(frame)
    frame = 0
  }

  function pauseAction(): void {
    const time = playhead()

    // flush up to the pause point; rAF may not tick again
    fireBetween(cursor, time, direction)
    cursor = time
    stopLoop()
    pauseAll()
    setStatus('paused')
  }

  function start(): void {
    if (!clock) {
      setStatus('finished')
      return
    }

    // rate first, then play: a flip while running must not seek
    applyRate()

    for (const animation of animations) animation.play()
    clock.play()

    setStatus('running')
    startLoop()
  }

  function jump(next: Direction): void {
    build()
    if (!clock) {
      setStatus('finished')
      return
    }

    // reduced motion: move to the destination without playing
    stopLoop()
    direction = next
    seekAll(next === 1 ? length : 0)
    pauseAll()
    cursor = next === 1 ? length : 0
    fireAll(next)

    setStatus('finished')
  }

  function startIn(next: Direction): void {
    if (reduce()) {
      jump(next)
      return
    }

    build()

    // a running timeline flips in place; no seek, so the playhead does not jump
    if (status === 'running') {
      if (direction !== next) {
        direction = next
        applyRate()
      }
      return
    }

    // idle or finished: start from the end the new direction begins at
    if (status === 'idle' || status === 'finished') {
      seekAll(next === 1 ? 0 : length)
      // -1 lets a callback at 0 run on the first forward frame
      cursor = next === 1 ? -1 : length
    }

    direction = next
    start()
  }

  function restartAction(): void {
    if (reduce()) {
      jump(1)
      return
    }
    build()

    // reset before playing, so restart does not depend on the current clock
    stopLoop()
    pauseAll()
    seekAll(0)
    direction = 1
    cursor = -1

    start()
  }

  function seekAction(time: number): void {
    build()
    const target = Math.min(length, Math.max(0, Number.isFinite(time) ? time : 0))
    const wasRunning = status === 'running'

    // pause first: seeking a running animation can make it jump
    stopLoop()
    pauseAll()
    seekAll(target)
    cursor = target

    // resume only inside the timeline; the ends are settled states
    if (wasRunning && target > 0 && target < length) start()
    else setStatus(target >= length ? 'finished' : 'paused')
  }

  function cancelAction(): void {
    // drop the finish handler before canceling so a stale finish is ignored
    if (clock) {
      clock.onfinish = null
      clock.cancel()
    }

    for (const animation of animations) animation.cancel()

    stopLoop()
    callbacks = []
    cursor = 0
    clock = null
    animations = []
    length = 0
    built = false
    direction = 1

    setStatus('idle')
  }

  const timeline: WaapiTimeline = {
    get isRunning() {
      return status === 'running'
    },
    get duration() {
      // the layout is known before the first build
      return built ? length : layout().length
    },
    get currentTime() {
      return playhead()
    },
    get progress() {
      const total = built ? length : layout().length
      if (!total) return 0
      return Math.min(1, Math.max(0, playhead() / total))
    },
    get paused() {
      return status === 'paused'
    },
    get completed() {
      return status === 'finished'
    },

    point(name, at) {
      assertMutable('point')
      if (!name) throw new Error('createWaapiTimeline: point() needs a name.')

      entries.push({ kind: 'point', name, at })
      layoutCache = null
      return timeline
    },
    tween(target, params) {
      assertMutable('tween')
      entries.push({ kind: 'tween', target, params })
      layoutCache = null
      return timeline
    },
    callback(input, at) {
      assertMutable('callback')
      const fn = typeof input === 'function' ? input : input.fn
      const position = typeof input === 'function' ? at : input.at
      if (typeof fn !== 'function') throw new Error('createWaapiTimeline: callback() needs a function.')

      entries.push({ kind: 'callback', fn, at: position })
      layoutCache = null
      return timeline
    },

    play() {
      startIn(1)
      return timeline
    },
    reverse() {
      startIn(-1)
      return timeline
    },
    resume() {
      if (status === 'paused') start()
      return timeline
    },
    pause() {
      if (status !== 'running') return timeline
      pauseAction()
      return timeline
    },

    restart() {
      restartAction()
      return timeline
    },
    alternate() {
      if (direction === 1) startIn(-1)
      else startIn(1)
      return timeline
    },
    seek(time) {
      seekAction(time)
      return timeline
    },
    cancel() {
      cancelAction()
      return timeline
    },
  }

  if (options.autoplay) startIn(1)

  return timeline
}
