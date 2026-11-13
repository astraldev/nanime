import { getCurrentInstance, onMounted, shallowRef, toValue } from 'vue'
import type { DOMTargetsParam } from 'animejs'
import { tryOnScopeDispose } from '../../utils/vue-helpers'
import { useReducedMotion } from '../../utils/reduced-motion'
import { normalizeWaapiAnimeTarget } from '../../utils/targets'
import { createWaapiTimeline } from './createWaapiTimeline'
import type { WaapiTimelineOptions } from './types'
import type { WaapiTimelineRef, WaapiTimelineRefTarget } from './types-ref'

function collectElements(target: DOMTargetsParam, elements: Element[]): void {
  if (typeof target === 'string') {
    if (target) elements.push(...document.querySelectorAll(target))
    return
  }
  if (target instanceof Element) {
    elements.push(target)
    return
  }
  if (Array.isArray(target)) {
    for (const entry of target) collectElements(entry, elements)
    return
  }
  for (const node of Array.from(target)) {
    if (node instanceof Element) elements.push(node)
  }
}

function resolveElements(target: WaapiTimelineRefTarget): Element[] {
  // refs, getters, selectors and component instances all normalize here
  const resolved = toValue(target)
  if (resolved === null || resolved === undefined || resolved === '') return []

  const normalized: DOMTargetsParam | null = normalizeWaapiAnimeTarget(resolved)
  if (!normalized) return []

  const elements: Element[] = []
  collectElements(normalized, elements)
  return Array.from(new Set(elements))
}

/**
 * Creates a native Web Animations timeline on mount and cancels it with the
 * scope.
 *
 * Register points and tweens with `point()` and `tween()`, then call
 * `play()`, `reverse()` or `seek()`. The browser owns the clock; no
 * JavaScript runs per frame. Experimental: import from
 * `#nanime/experimental` or `nanime/experimental`.
 */
export function useWaapiTimeline(options: WaapiTimelineOptions = {}): WaapiTimelineRef {
  const { isReduced } = useReducedMotion()
  const running = shallowRef(false)
  const instance = getCurrentInstance()

  const core = createWaapiTimeline({
    ...options,
    autoplay: false,
    isReducedMotion: options.isReducedMotion ?? isReduced,
    onRunningChange: (value) => {
      running.value = value
      options.onRunningChange?.(value)
    },
  })

  let pending: Array<() => void> = []
  let autoplay = options.autoplay
  let mounted = !instance

  function run(action: () => void): void {
    // preserve call order: play() then pause() must end paused, not idle
    if (mounted) action()
    else pending.push(action)
  }

  function flush(): void {
    mounted = true
    const actions = pending
    pending = []

    // match the factory: autoplay starts first, then queued calls apply
    if (autoplay) core.play()
    for (const action of actions) action()
  }

  const timeline: WaapiTimelineRef = {
    get isRunning() {
      return running
    },
    get duration() {
      return core.duration
    },
    get currentTime() {
      return core.currentTime
    },
    get progress() {
      return core.progress
    },
    get paused() {
      return core.paused
    },
    get completed() {
      return core.completed
    },

    point(name, at) {
      core.point(name, at)
      return timeline
    },
    tween(target, params) {
      core.tween(() => resolveElements(target), params)
      return timeline
    },
    callback(input, at) {
      core.callback(input, at)
      return timeline
    },

    play() {
      run(() => core.play())
      return timeline
    },
    reverse() {
      run(() => core.reverse())
      return timeline
    },
    resume() {
      run(() => core.resume())
      return timeline
    },
    pause() {
      run(() => core.pause())
      return timeline
    },

    restart() {
      run(() => core.restart())
      return timeline
    },
    alternate() {
      run(() => core.alternate())
      return timeline
    },
    seek(time) {
      run(() => core.seek(time))
      return timeline
    },
    cancel() {
      pending = []
      autoplay = false
      core.cancel()
      return timeline
    },
  }

  if (instance) onMounted(flush)
  else if (autoplay) core.play()

  tryOnScopeDispose(() => {
    pending = []
    autoplay = false
    core.cancel()
  })

  return timeline
}
