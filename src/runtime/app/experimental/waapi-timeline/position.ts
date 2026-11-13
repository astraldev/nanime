import type { WaapiTimelinePosition } from './types'

export interface PointTime {
  time: number
  duration: number
}

export interface PositionContext {
  points: ReadonlyMap<string, PointTime>
  previous: { start: number, end: number, duration: number } | null
}

type Unit = 'ms' | 's' | '%'

interface Term {
  sign: 1 | -1
  value: number
  unit: Unit
}

const TERM = /^([+-]?)\s*(\d+(?:\.\d+)?)\s*(ms|s|%)?$/

function parseTerms(source: string): Term[] | null {
  // split on signs, so 'open 50% + 150ms' becomes two additive terms
  const parts = source.split(/(?=[+-])/).filter(part => part.trim().length > 0)
  if (!parts.length) return []

  const terms: Term[] = []
  for (const part of parts) {
    const match = TERM.exec(part.trim())
    if (!match) return null
    const unit: Unit = match[3] === 's' || match[3] === '%' ? match[3] : 'ms'
    terms.push({
      sign: match[1] === '-' ? -1 : 1,
      value: Number(match[2] ?? '0'),
      unit,
    })
  }
  return terms
}

function applyTerms(base: number, duration: number, terms: Term[]): number {
  let time = base
  for (const term of terms) {
    const amount = term.unit === '%'
      ? duration * term.value / 100
      : term.unit === 's' ? term.value * 1000 : term.value
    time += term.sign * amount
  }
  return time
}

function hasShiftSeparator(source: string): boolean {
  // 'open 50%' is a shift; 'open50%' is an unknown point name
  return source === '' || /^[\s+-]/.test(source)
}

export function resolveAt(at: WaapiTimelinePosition | undefined, context: PositionContext): number {
  if (at === undefined) return 0
  if (typeof at === 'number') {
    if (!Number.isFinite(at)) throw new Error('createWaapiTimeline: at must be a finite number.')
    return at
  }

  // an exact point name wins before any shift parsing
  const point = context.points.get(at)
  if (point) return point.time

  // '<' is the previous tween's start; bare, it has no terms
  if (at === '<') return context.previous?.start ?? 0

  if (at.startsWith('<')) {
    const rest = at.slice(1)
    if (hasShiftSeparator(rest)) {
      const terms = parseTerms(rest)
      if (terms) return applyTerms(context.previous?.start ?? 0, context.previous?.duration ?? 0, terms)
    }
  }

  // try the longest point name first, so names with spaces or signs survive
  const names = [...context.points.keys()].sort((a, b) => b.length - a.length)
  for (const name of names) {
    if (!at.startsWith(name)) continue
    const rest = at.slice(name.length)
    if (!hasShiftSeparator(rest)) continue
    const terms = parseTerms(rest)
    if (!terms) continue
    const base = context.points.get(name)
    if (base) return applyTerms(base.time, base.duration, terms)
  }

  throw new Error(`createWaapiTimeline: unknown point "${at}".`)
}
