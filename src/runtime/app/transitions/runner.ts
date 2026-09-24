import type { AnimationParams } from 'animejs'
import { animate, type JSAnimation } from 'animejs/animation'
import type { BaseTransitionProps } from 'vue'

export const ACTIVE_ATTRIBUTE = 'data-anime-transition'

type StyledElement = HTMLElement | SVGElement

export interface TransitionRunnerOptions {
  enter: () => AnimationParams
  leave: () => AnimationParams
  onLeaveStart?: (el: Element) => void
  onEnd?: (el: StyledElement) => void
}

const isStyled = (el: Element): el is StyledElement => el instanceof HTMLElement || el instanceof SVGElement

export function createTransitionRunner(options: TransitionRunnerOptions) {
  const running = new Map<StyledElement, JSAnimation>()

  function stop(el: Element) {
    if (isStyled(el)) running.get(el)?.cancel()
  }

  function run(el: Element, params: AnimationParams, done: () => void) {
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
    if (!ended) running.set(el, animation)
  }

  const hooks: BaseTransitionProps<Element> = {
    onEnter(el, done) {
      run(el, options.enter(), done)
    },
    onLeave(el, done) {
      options.onLeaveStart?.(el)
      run(el, options.leave(), done)
    },
    onEnterCancelled: stop,
    onLeaveCancelled: stop,
    onAfterLeave: stop,
  }

  return {
    hooks,
    running: () => running.keys(),
    refresh: () => running.forEach(animation => animation.seek(animation.currentTime)),
    dispose: () => [...running.keys()].forEach(stop),
  }
}
