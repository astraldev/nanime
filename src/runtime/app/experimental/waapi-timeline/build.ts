import { isPair, isRange, type TrackInput } from './layout'
import type { WaapiTimelineFill, WaapiTimelineFrame } from './types'

interface BuiltTrack {
  element: Element
  property: string
  value: WaapiTimelineFrame
  start: number
  duration: number
  ease: string
  order: number
}

export interface TimelineElementTween {
  elements: Element[]
  tracks: TrackInput[]
  start: number
  duration: number
  ease: string
}

export interface TimelineElementLayout {
  length: number
  tweens: TimelineElementTween[]
}

export interface BuiltTimeline {
  length: number
  animations: Animation[]
  clock: Animation
}

function persist(animation: Animation): void {
  // Chrome drops a finished fill animation when a later one covers it.
  // Keeping it alive is what makes reverse and replay retrace the same values.
  const method: unknown = Reflect.get(animation, 'persist')
  if (typeof method === 'function') Reflect.apply(method, animation, [])
}

function toFrames(property: string, value: WaapiTimelineFrame): Keyframe[] {
  if (isPair(value)) return [{ [property]: value[0] }, { [property]: value[1] }]
  if (isRange(value)) {
    if (value.from !== undefined && value.to !== undefined) {
      return [{ [property]: value.from }, { [property]: value.to }]
    }
    if (value.to !== undefined) return [{ [property]: value.to }]
    // a from-only value still needs an explicit first keyframe
    if (value.from !== undefined) return [{ [property]: value.from, offset: 0 }]
    return []
  }
  return [{ [property]: value }]
}

function collectTracks(layout: TimelineElementLayout): BuiltTrack[] {
  // flatten each tween into element and property tracks
  const tracks: BuiltTrack[] = []
  let order = 0

  for (const tween of layout.tweens) {
    for (const element of tween.elements) {
      for (const track of tween.tracks) {
        tracks.push({
          element,
          property: track.property,
          value: track.value,
          start: tween.start,
          duration: tween.duration,
          ease: tween.ease,
          order,
        })
        order++
      }
    }
  }

  return tracks
}

function groupTracks(tracks: BuiltTrack[]): Map<Element, Map<string, BuiltTrack[]>> {
  const groups = new Map<Element, Map<string, BuiltTrack[]>>()

  for (const track of tracks) {
    let properties = groups.get(track.element)
    if (!properties) {
      properties = new Map()
      groups.set(track.element, properties)
    }
    const entries = properties.get(track.property) ?? []
    entries.push(track)
    properties.set(track.property, entries)
  }

  return groups
}

export function buildTimeline(layout: TimelineElementLayout, fill: WaapiTimelineFill): BuiltTimeline {
  const animations: Animation[] = []

  const groups = groupTracks(collectTracks(layout))

  for (const properties of groups.values()) {
    for (const tracks of properties.values()) {
      tracks.sort((a, b) => a.start - b.start || a.order - b.order)
      tracks.forEach((track, index) => {
        const frames = toFrames(track.property, track.value)
        if (!frames.length) return

        // 'auto': the first tween on a property fills both, later ones forwards
        const mode: FillMode = fill === 'auto'
          ? index === 0 ? 'both' : 'forwards'
          : fill

        // endDelay keeps every animation ending at the timeline end, so
        // reverse playback starts from one shared boundary
        const effect = new KeyframeEffect(track.element, frames, {
          duration: track.duration,
          delay: track.start,
          endDelay: layout.length - (track.start + track.duration),
          easing: track.ease,
          fill: mode,
        })
        const animation = new Animation(effect)
        persist(animation)
        animations.push(animation)
      })
    }
  }

  // a targetless clock: it has no visual effect and only reports the end
  const clock = new Animation(new KeyframeEffect(null, null, layout.length))
  persist(clock)

  return { length: layout.length, animations, clock }
}
