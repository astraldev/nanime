import type { AnimationParams, FunctionValue } from 'animejs'
import { animate, type JSAnimation } from 'animejs/animation'
import type { BaseTransitionProps } from 'vue'
import { SHARED_ANIME_JS_CALLBACKS } from '../utils/instance/shared-callbacks'

export const ACTIVE_ATTRIBUTE = 'data-anime-transition'

type StyledElement = HTMLElement | SVGElement

const NOT_FUNCTION_VALUES = new Set([
  ...SHARED_ANIME_JS_CALLBACKS,
  'ease',
  'playbackEase',
  'modifier',
  'keyframes',
])

const isFunctionValue = (key: string, value: unknown): value is FunctionValue =>
  typeof value === 'function' && !NOT_FUNCTION_VALUES.has(key)

function resolveForBatch(params: AnimationParams, el: StyledElement, batch: StyledElement[]): AnimationParams {
  const targets = batch.includes(el) ? batch : [el]
  const resolved: AnimationParams = { ...params }
  for (const [key, value] of Object.entries(params)) {
    if (isFunctionValue(key, value)) resolved[key] = value(el, targets.indexOf(el), targets)
  }
  return resolved
}

export interface TransitionRunnerOptions {
  enter: () => AnimationParams
  leave: () => AnimationParams
  onLeaveStart?: (el: Element) => void
  onEnd?: (el: StyledElement) => void
}

const isStyled = (el: Element): el is StyledElement => el instanceof HTMLElement || el instanceof SVGElement

export function createTransitionRunner(options: TransitionRunnerOptions) {
  const running = new Map<StyledElement, JSAnimation>()
  const entering: StyledElement[] = []
  const leaving: StyledElement[] = []

  function addToBatch(batch: StyledElement[], els: Element[]) {
    if (!batch.length) queueMicrotask(() => (batch.length = 0))
    batch.push(...els.filter(isStyled))
  }

  function stop(el: Element) {
    if (isStyled(el)) running.get(el)?.cancel()
  }

  function run(el: Element, params: AnimationParams, batch: StyledElement[], done: () => void) {
    stop(el)
    if (!isStyled(el)) return done()

    let ended = false
    const end = () => {
      if (ended) return
      ended = true
      running.delete(el)
      el.removeAttribute(ACTIVE_ATTRIBUTE)
      options.onEnd?.(el)
      done()
    }

    el.setAttribute(ACTIVE_ATTRIBUTE, '')
    const animation = animate(el, {
      ...resolveForBatch(params, el, batch),
      onComplete(self) {
        params.onComplete?.(self)
        end()
      },
      onPause(self) {
        params.onPause?.(self)
        if (self.cancelled) end()
      },
    })
    if (!ended) running.set(el, animation)
  }

  const hooks: BaseTransitionProps<Element> = {
    onBeforeEnter(el) {
      addToBatch(entering, [el])
    },
    onEnter(el, done) {
      run(el, options.enter(), entering, done)
    },
    onLeave(el, done) {
      options.onLeaveStart?.(el)
      run(el, options.leave(), leaving, done)
    },
    onEnterCancelled: stop,
    onLeaveCancelled: stop,
    onAfterLeave: stop,
  }

  return {
    hooks,
    expectLeaving: (els: Element[]) => addToBatch(leaving, els),
    running: () => running.keys(),
    refresh: () => running.forEach(animation => animation.seek(animation.currentTime)),
    dispose: () => [...running.keys()].forEach(stop),
  }
}
