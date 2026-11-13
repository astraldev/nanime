import { cubicBezier, eases, irregular } from 'animejs/easings'
import { waapi } from 'animejs/waapi'
import type { EasingFunction, EasingParam, Spring } from 'animejs'

const CSS_EASE = /^(?:linear|ease|cubic-bezier|steps|step-start|step-end)\b/
const PARAMETERIZED = /^(?:in|out|inOut|outIn)$/

export interface ResolvedEase {
  easing: string
  duration?: number
}

function isSpring(ease: EasingParam): ease is Spring {
  return typeof ease === 'object' && ease !== null && 'ease' in ease
}

const warnedEases = new Set<string>()

function warnUnknown(ease: string): void {
  if (warnedEases.has(ease)) return
  warnedEases.add(ease)
  console.warn(`createWaapiTimeline: unknown ease "${ease}", using linear.`)
}

function parseEaseName(ease: string): EasingFunction | undefined {
  if (ease === 'none') return undefined

  const open = ease.indexOf('(')
  if (open !== -1 && !ease.endsWith(')')) return undefined

  const name = open === -1 ? ease : ease.slice(0, open)
  const args = open === -1 ? [] : ease.slice(open + 1, -1).split(',').map(value => Number(value))
  if (args.some(value => !Number.isFinite(value))) return undefined

  if (name === 'cubicBezier') return cubicBezier(args[0], args[1], args[2], args[3])
  if (name === 'irregular') return irregular(args[0], args[1])

  if (!Object.prototype.hasOwnProperty.call(eases, name)) return undefined

  const factory: unknown = Reflect.get(eases, name)
  if (typeof factory !== 'function') return undefined

  const parameterized = open !== -1 || PARAMETERIZED.test(name) || name.includes('Back') || name.includes('Elastic')
  if (!parameterized) return time => Number(Reflect.apply(factory, eases, [time]))

  const resolved: unknown = Reflect.apply(factory, eases, args)
  return typeof resolved === 'function'
    ? time => Number(Reflect.apply(resolved, eases, [time]))
    : undefined
}

/**
 * Turns an AnimeJS easing, a function or a spring into a CSS easing string.
 * CSS easing strings pass through unchanged.
 */
export function resolveEase(ease: EasingParam): ResolvedEase {
  if (typeof ease === 'string') {
    if (ease === 'none') return { easing: 'linear' }
    if (CSS_EASE.test(ease)) return { easing: ease }

    const fn = parseEaseName(ease)
    if (!fn) warnUnknown(ease)
    return { easing: fn ? waapi.convertEase(fn) : 'linear' }
  }

  if (typeof ease === 'function') return { easing: waapi.convertEase(ease) }

  if (isSpring(ease)) {
    return {
      easing: waapi.convertEase(ease.ease),
      duration: ease.settlingDuration,
    }
  }

  return { easing: 'linear' }
}
