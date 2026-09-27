import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { useAnimeScroll } from '#nanime/composables'
import { createDrawable } from '#nanime/proxies/svg'
import type { DrawableSVGGeometry, ScrollObserverParams } from '#nanime/types'

// "<viewport edge> <element edge>", e.g. 'bottom top' starts when the element's top enters from below.
export type Threshold = ScrollObserverParams['enter']

// A scroll observer that scrubs whatever it autoplays while `target` crosses the screen.
// Its `onUpdate` also fires after a jump seeks to progress 0, where an animation's own onUpdate does not.
export function useScrub(target: MaybeRefOrGetter<Element | null | undefined>, enter: Threshold, leave: Threshold, onUpdate?: ScrollObserverParams['onUpdate']) {
  return useAnimeScroll(() => ({ target: toValue(target) ?? undefined, enter, leave, sync: true, onUpdate }))
}

export function useDrawable(element: MaybeRefOrGetter<SVGGeometryElement | null | undefined>) {
  return computed<DrawableSVGGeometry | null>(() => {
    const geometry = toValue(element)
    return geometry ? createDrawable(geometry)[0] ?? null : null
  })
}
