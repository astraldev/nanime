import { warn } from 'vue'
import type { AnimationParams, EasingFunction, WAAPIAnimationParams } from 'animejs'
import { engine } from 'animejs/engine'
import { Spring } from 'animejs/easings'

export type TransitionEngine = 'js' | 'waapi'

export type TransitionParams
  = | { engine: 'js', params: AnimationParams }
    | { engine: 'waapi', params: AnimationParams & WAAPIAnimationParams }

export type EngineParams
  = | { engine: 'js', params: AnimationParams }
    | { engine: 'waapi', params: WAAPIAnimationParams }

type Ease = string | EasingFunction | Spring

interface SharedTween {
  to?: string | number
  from?: string | number
  duration?: number
  delay?: number
  ease?: Ease
}

type SharedValue = string | number | boolean | Array<string | number> | SharedTween | Ease

type SharedParams = Record<string, SharedValue>

const SHARED_OPTIONS = new Set(['duration', 'delay', 'ease', 'loop', 'reversed', 'alternate', 'autoplay', 'playbackRate', 'persist'])

const TWEEN_KEYS = new Set(['to', 'from', 'duration', 'delay', 'ease'])

const isPrimitive = (value: unknown): value is string | number => typeof value === 'string' || typeof value === 'number'

const isEasingFunction = (value: unknown): value is EasingFunction => typeof value === 'function'

const isEase = (value: unknown): value is Ease => typeof value === 'string' || isEasingFunction(value) || value instanceof Spring

function isRecord(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null) return false
  const prototype = Object.getPrototypeOf(value)
  return prototype === Object.prototype || prototype === null
}

function isSharedTween(value: unknown): value is SharedTween {
  if (!isRecord(value)) return false
  return Object.entries(value).every(([key, item]) => TWEEN_KEYS.has(key) && (key === 'ease' ? isEase(item) : isPrimitive(item)))
}

function isSharedValue(key: string, value: unknown): value is SharedValue {
  if (key === 'ease') return isEase(value)
  if (key in engine.defaults && !SHARED_OPTIONS.has(key)) return false
  if (isPrimitive(value) || typeof value === 'boolean') return true
  if (Array.isArray(value)) return value.every(isPrimitive)
  return isSharedTween(value)
}

function describe(key: string, value: unknown): string {
  if (Array.isArray(value)) return `\`${key}\` with keyframe objects`
  const inner = isRecord(value) ? Object.keys(value).find(item => !TWEEN_KEYS.has(item)) : undefined
  return inner ? `\`${key}\` with \`${inner}\`` : `\`${key}\``
}

function toShared(params: AnimationParams): SharedParams | string {
  const shared: SharedParams = {}
  for (const [key, value] of Object.entries<unknown>(params)) {
    if (!isSharedValue(key, value)) return describe(key, value)
    shared[key] = value
  }
  return shared
}

export interface TransitionSource {
  component: string
  part: 'enter' | 'leave'
}

const warned = new Set<string>()

function warnOnce({ component, part }: TransitionSource, blocker: string) {
  const message = `[nanime] <${component}> ${part} uses ${blocker}, which \`waapi.animate()\` can't run, so it runs with \`animate()\`.`
  if (warned.has(message)) return
  warned.add(message)
  warn(message)
}

export function toEngine(prepared: TransitionParams, wanted: TransitionEngine, source: TransitionSource): EngineParams {
  if (prepared.engine === 'waapi') {
    return wanted === 'waapi' ? { engine: 'waapi', params: prepared.params } : { engine: 'js', params: prepared.params }
  }
  if (wanted === 'js') return prepared
  const shared = toShared(prepared.params)
  if (typeof shared !== 'string') return { engine: 'waapi', params: shared }
  warnOnce(source, shared)
  return prepared
}
