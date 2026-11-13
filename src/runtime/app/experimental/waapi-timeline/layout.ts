import { resolveEase } from './easing'
import { resolveAt, type PointTime, type PositionContext } from './position'
import type {
  WaapiTimelineDefaults,
  WaapiTimelineFrame,
  WaapiTimelinePair,
  WaapiTimelinePosition,
  WaapiTimelineRange,
  WaapiTimelineTarget,
  WaapiTweenParams,
} from './types'

export interface RegisteredPoint {
  kind: 'point'
  name: string
  at: WaapiTimelinePosition
}

export interface RegisteredTween {
  kind: 'tween'
  target: WaapiTimelineTarget
  params: WaapiTweenParams
}

export interface RegisteredCallback {
  kind: 'callback'
  fn: () => void
  at: WaapiTimelinePosition | undefined
}

export type RegisteredEntry = RegisteredPoint | RegisteredTween | RegisteredCallback

export interface TrackInput {
  property: string
  value: WaapiTimelineFrame
}

export interface ResolvedTween {
  target: WaapiTimelineTarget
  tracks: TrackInput[]
  start: number
  duration: number
  ease: string
}

export interface ResolvedCallback {
  fn: () => void
  time: number
}

export interface TimelineLayout {
  length: number
  tweens: ResolvedTween[]
  callbacks: ResolvedCallback[]
}

const RESERVED = new Set(['at', 'duration', 'delay', 'ease'])

export function isPair(value: unknown): value is WaapiTimelinePair {
  if (!Array.isArray(value) || value.length !== 2) return false
  const from: unknown = value[0]
  const to: unknown = value[1]
  return (typeof from === 'string' && typeof to === 'string')
    || (typeof from === 'number' && typeof to === 'number')
}

export function isRange(value: unknown): value is WaapiTimelineRange {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false
  const from = Reflect.get(value, 'from')
  const to = Reflect.get(value, 'to')
  const validFrom = from === undefined || typeof from === 'string' || typeof from === 'number'
  const validTo = to === undefined || typeof to === 'string' || typeof to === 'number'
  if (!validFrom || !validTo) return false
  return from !== undefined || to !== undefined
}

function normalizeDuration(value: number): number {
  return Number.isFinite(value) ? Math.max(0, value) : 0
}

function normalizeDelay(value: number): number {
  return Number.isFinite(value) ? value : 0
}

function readTween(params: WaapiTweenParams, defaults: WaapiTimelineDefaults) {
  const at = params.at
  const resolvedEase = resolveEase(params.ease ?? defaults.ease ?? 'linear')
  const duration = normalizeDuration(params.duration ?? resolvedEase.duration ?? defaults.duration ?? 300)
  const ease = resolvedEase.easing
  const delay = normalizeDelay(params.delay ?? 0)
  const tracks: TrackInput[] = []

  // reserved keys describe the tween; every other key is a CSS property
  for (const [property, value] of Object.entries(params)) {
    if (RESERVED.has(property) || value === undefined) continue
    if (typeof value === 'string' || typeof value === 'number' || isPair(value) || isRange(value)) {
      tracks.push({ property, value })
      continue
    }
    throw new Error(`createWaapiTimeline: "${property}" must be a value, a [from, to] pair, or a { from, to } object. Intermediate keyframes are not supported.`)
  }

  return { at, duration, ease, delay, tracks }
}

export function layoutTimeline(entries: RegisteredEntry[], defaults: WaapiTimelineDefaults): TimelineLayout {
  const points = new Map<string, PointTime>()
  const tweens: ResolvedTween[] = []
  const callbacks: ResolvedCallback[] = []
  let length = 0
  let previous: { start: number, end: number, duration: number } | null = null

  for (const entry of entries) {
    const context: PositionContext = { points, previous }
    if (entry.kind === 'point') {
      // a point keeps the duration of the tween before it for '%' shifts
      points.set(entry.name, { time: resolveAt(entry.at, context), duration: previous?.duration ?? 0 })
      continue
    }

    if (entry.kind === 'callback') {
      const time = resolveAt(entry.at, context)
      callbacks.push({ fn: entry.fn, time })
      length = Math.max(length, time)
      continue
    }

    const values = readTween(entry.params, defaults)
    // '<' shifts measure from the previous tween, so keep it on the context
    const start = resolveAt(values.at, context) + values.delay
    const end = start + values.duration
    tweens.push({
      target: entry.target,
      tracks: values.tracks,
      start,
      duration: values.duration,
      ease: values.ease,
    })
    previous = { start, end, duration: values.duration }
    length = Math.max(length, end)
  }

  return { length: Math.max(0, length), tweens, callbacks }
}
