import type { FunctionValue } from 'animejs'
import { animate, type JSAnimation } from 'animejs/animation'
import { waapi, type WAAPIAnimation } from 'animejs/waapi'
import type { BaseTransitionProps } from 'vue'
import { SHARED_ANIME_JS_CALLBACKS } from '../utils/instance/shared-callbacks'
import { TRANSITION_ATTRIBUTE } from '../utils/markers'
import type { WithReducedMotion } from '../utils/reduced-motion'
import { toEngine, type TransitionEngine, type TransitionParams } from './engine'

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

function resolveForBatch<Params extends object>(params: Params, el: StyledElement, batch: StyledElement[]): Params {
  const targets = batch.includes(el) ? batch : [el]
  const resolved = { ...params }
  for (const [key, value] of Object.entries(params)) {
    if (isFunctionValue(key, value)) Reflect.set(resolved, key, value(el, targets.indexOf(el), targets))
  }
  return resolved
}

type Running = JSAnimation | WAAPIAnimation

export interface TransitionRunnerOptions {
  component: string
  withReducedMotion: WithReducedMotion
  engine: () => TransitionEngine
  enter: () => TransitionParams
  leave: () => TransitionParams
  onLeaveStart?: (el: Element) => void
  onEnd?: (el: StyledElement) => void
}

const isStyled = (el: Element): el is StyledElement => el instanceof HTMLElement || el instanceof SVGElement

export function createTransitionRunner(options: TransitionRunnerOptions) {
  const running = new Map<StyledElement, { animation: Running, end: () => void }>()
  const entering: StyledElement[] = []
  const leaving: StyledElement[] = []

  function addToBatch(batch: StyledElement[], els: Element[]) {
    if (!batch.length) queueMicrotask(() => (batch.length = 0))
    batch.push(...els.filter(isStyled))
  }

  function stop(el: Element) {
    if (!isStyled(el)) return
    const entry = running.get(el)
    if (!entry) return
    entry.animation.cancel()
    entry.end()
  }

  function prepare(source: TransitionParams, el: StyledElement, batch: StyledElement[]): TransitionParams {
    return source.engine === 'waapi'
      ? { engine: 'waapi', params: resolveForBatch(source.params, el, batch) }
      : { engine: 'js', params: resolveForBatch(source.params, el, batch) }
  }

  function start(el: StyledElement, source: TransitionParams, batch: StyledElement[], end: () => void, isLeave: boolean): Running {
    const part = isLeave ? 'leave' : 'enter'
    const resolved = toEngine(prepare(source, el, batch), options.engine(), { component: options.component, part })
    if (resolved.engine === 'waapi') {
      const params = options.withReducedMotion(resolved.params)
      const animation = waapi.animate(el, {
        ...params,
        onComplete(self) {
          params.onComplete?.(self)
          end()
        },
      })
      if (!animation.animations.length) end()
      return animation
    }
    const params = options.withReducedMotion(resolved.params)
    return animate(el, {
      ...params,
      onComplete(self) {
        params.onComplete?.(self)
        end()
      },
      onPause(self) {
        params.onPause?.(self)
        if (self.cancelled) end()
      },
    })
  }

  function run(el: Element, params: TransitionParams, batch: StyledElement[], done: () => void, isLeave: boolean) {
    stop(el)
    if (!isStyled(el)) return queueMicrotask(done)

    let animation: Running | null = null
    let ended = false
    let starting = true
    const end = () => {
      if (ended) return
      ended = true
      running.delete(el)
      if (isLeave) animation?.revert()
      el.removeAttribute(TRANSITION_ATTRIBUTE)
      options.onEnd?.(el)
      if (starting) queueMicrotask(done)
      else done()
    }

    el.setAttribute(TRANSITION_ATTRIBUTE, '')
    animation = start(el, params, batch, end, isLeave)
    starting = false
    if (!ended) running.set(el, { animation, end })
    else if (isLeave) animation.revert()
  }

  const hooks: BaseTransitionProps<Element> = {
    onBeforeEnter(el) {
      addToBatch(entering, [el])
    },
    onEnter(el, done) {
      run(el, options.enter(), entering, done, false)
    },
    onLeave(el, done) {
      options.onLeaveStart?.(el)
      run(el, options.leave(), leaving, done, true)
    },
    onEnterCancelled: stop,
    onLeaveCancelled: stop,
  }

  return {
    hooks,
    expectLeaving: (els: Element[]) => addToBatch(leaving, els),
    running: () => running.keys(),
    refresh: () => running.forEach(({ animation }) => animation.seek(animation.currentTime)),
    complete: () => [...running.values()].forEach(({ animation }) => animation.complete()),
    dispose: () => [...running.keys()].forEach(stop),
  }
}
