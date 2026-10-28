import { useNanimeConfig } from './config'

let systemPrefersReduced = false
let listening = false

function listen() {
  if (listening || typeof window === 'undefined' || typeof window.matchMedia !== 'function') return
  listening = true
  const query = window.matchMedia('(prefers-reduced-motion: reduce)')
  systemPrefersReduced = query.matches
  query.addEventListener('change', (event) => {
    systemPrefersReduced = event.matches
  })
}

export type IsReducedMotion = () => boolean

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null) return false
  const prototype = Object.getPrototypeOf(value)
  return prototype === Object.prototype || prototype === null
}

function zeroTimings(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(zeroTimings)
  if (!isPlainObject(value)) return value
  const copy = { ...value }
  for (const [key, child] of Object.entries(copy)) copy[key] = zeroTimings(child)
  if ('duration' in copy) copy.duration = 0
  if ('delay' in copy) copy.delay = 0
  if ('ease' in copy) copy.ease = 'linear'
  return copy
}

export function zeroNestedTimings<Params extends object>(params: Params): Params {
  const copy = { ...params }
  for (const [key, child] of Object.entries(copy)) Reflect.set(copy, key, zeroTimings(child))
  return copy
}

export function useReducedMotion() {
  const config = useNanimeConfig()

  const isReduced: IsReducedMotion = () => {
    listen()
    const setting = config().reducedMotion ?? 'never'
    return setting === 'always' || (setting === 'system' && systemPrefersReduced)
  }

  function withReducedMotion<Params extends object>(params: Params): Params {
    if (!isReduced()) return params
    return Object.assign(zeroNestedTimings(params), { duration: 0, delay: 0, loopDelay: 0, loop: 0, ease: 'linear' })
  }

  return { isReduced, withReducedMotion }
}

export type WithReducedMotion = ReturnType<typeof useReducedMotion>['withReducedMotion']
