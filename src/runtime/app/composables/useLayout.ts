import { computed, shallowRef, toValue, watchEffect, type MaybeRef, type MaybeRefOrGetter } from '#imports'
import { createLayout, type AutoLayoutParams, type LayoutAnimationParams } from 'animejs/layout'
import { normalizeLayoutTarget } from '../utils/normalize-targets'
import { extractNonFunctionProperties } from '../utils/extract-props'
import { tryOnScopeDispose, useMounted } from '@vueuse/core'

export function useAnimeLayout(
  target: MaybeRef<Parameters<typeof normalizeLayoutTarget>[0]>,
  options?: MaybeRefOrGetter<AutoLayoutParams>,
) {
  const mounted = useMounted()
  const layout = shallowRef<ReturnType<typeof createLayout> | null>(null)

  watchEffect(() => {
    if (!mounted.value) return
    const wrapper = normalizeLayoutTarget(toValue(target))
    if (!wrapper) return
    const newLayout = createLayout(wrapper, toValue(options) || {})
    layout.value = newLayout
  })

  tryOnScopeDispose(() => {
    layout.value?.revert()
    layout.value = null
  })

  return {
    properties: computed(() => layout.value ? extractNonFunctionProperties(layout.value) : undefined),
    record: () => layout.value?.record(),
    revert: () => layout.value?.revert(),
    animate: (options?: LayoutAnimationParams, cb?: () => void) => {
      const animation = layout.value?.animate(options || {})
      if (!animation && cb) return cb()
      if (!animation) return
      animation.play()
      animation.then(() => cb?.())
      if (animation.completed) return cb?.()
      return animation
    },
  }
}
