import type { DOMTargetSelector } from 'animejs'
import type { AutoLayout, AutoLayoutParams } from 'animejs/layout'
import { warn } from 'vue'
import type { NanimeTrackTargetsOnly, TrackTargetsOnlyOptions } from '../public/types'

declare const __NANIME_TRACK_TARGETS_ONLY__: NanimeTrackTargetsOnly

type PatchedCreateLayout = (root: DOMTargetSelector, params?: AutoLayoutParams & TrackTargetsOnlyOptions) => AutoLayout

let loaded: PatchedCreateLayout | null = null
let loading: Promise<PatchedCreateLayout> | null = null
let warned = false

export function resolveTrackTargetsOnly(requested: boolean | undefined): boolean {
  if (__NANIME_TRACK_TARGETS_ONLY__ === 'off') {
    if (requested && !warned) {
      warned = true
      warn('[nanime] trackTargetsOnly is off. Set `experimental: { trackTargetsOnly: \'opt-in\' }` in the nanime module options to use it; using the stock layout.')
    }
    return false
  }
  return requested ?? __NANIME_TRACK_TARGETS_ONLY__ === 'global'
}

export function loadPatchedLayout(): PatchedCreateLayout | Promise<PatchedCreateLayout> {
  if (loaded) return loaded
  loading ||= __NANIME_TRACK_TARGETS_ONLY__ === 'off'
    ? Promise.reject(new Error('[nanime] trackTargetsOnly is off in the module options.'))
    : import('./core/layout/layout.js').then(
        (module) => {
          loaded = module.createLayout
          return module.createLayout
        },
        (cause: unknown) => {
          loading = null
          throw new Error('[nanime] the patched AnimeJS layout is missing; run `pnpm patch:animejs`.', { cause })
        },
      )
  return loading
}
