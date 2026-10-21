import { defineComponent, h, onBeforeUpdate, onUpdated, shallowRef, useId, warn } from 'vue'
import type { AutoLayoutParams } from 'animejs/layout'
import { spring } from 'animejs/easings'
import type { DOMTargetSelector } from 'animejs'
import type { AnimeLayoutElements, AnimeLayoutGroupProps } from '../public/types'
import { useAnimeLayout } from '../composables/useAnimeLayout'
import { assignDefined, useComponentDefaults } from '../utils/component-defaults'
import { watchDeps } from '../utils/deps'
import { onTabHidden } from '../utils/tab-hidden'
import { LAYOUT_GROUP_ATTRIBUTE } from '../utils/markers'
import { normalizeLayoutTarget } from '../utils/targets'

export type { AnimeLayoutGroupProps } from '../public/types'

const noop = () => {}
const warned = new Set<string>()
const builtInEase = spring({ bounce: 0.15, duration: 300 })

const isList = (value: AnimeLayoutElements): value is Extract<AnimeLayoutElements, readonly unknown[]> =>
  Array.isArray(value)

function isValidSelector(selector: string) {
  try {
    document.createDocumentFragment().querySelector(selector)
    return true
  }
  catch {
    return false
  }
}

function checkSelector(selector: string) {
  if (typeof document === 'undefined' || warned.has(selector) || isValidSelector(selector)) return
  warned.add(selector)
  warn(`[nanime] <AnimeLayoutGroup> elements selector "${selector}" is not a valid selector. Invalid entries in it match nothing.`)
}

export default defineComponent(
  (props: AnimeLayoutGroupProps, { slots }) => {
    const { layers, option } = useComponentDefaults('layoutGroup')
    const root = shallowRef<HTMLElement | null>(null)
    const id = useId()
    const scope = `[${LAYOUT_GROUP_ATTRIBUTE}="${id}"]`

    function resolveElements(elements: AnimeLayoutElements): DOMTargetSelector[] {
      const entries = isList(elements) ? elements.flat() : [elements]
      return entries.flatMap((entry) => {
        if (typeof entry !== 'string') {
          const element = normalizeLayoutTarget(entry)
          return element ? [element] : []
        }
        checkSelector(entry)
        return [`${scope} :is(${entry}):not(${scope} [${LAYOUT_GROUP_ATTRIBUTE}] *)`]
      })
    }

    function layoutParams(): AutoLayoutParams {
      const options = assignDefined<AutoLayoutParams>({}, ...layers.value.map(layer => layer.layoutOptions), props.layoutOptions)
      if (options.ease === undefined && options.duration === undefined) options.ease = builtInEase
      const elements = option(props, 'elements')
      return elements === undefined ? options : { ...options, children: resolveElements(elements) }
    }

    const layout = useAnimeLayout(root, layoutParams)
    watchDeps(() => props.deps, option(props, 'shallow') ?? false, () => layout.patch?.(noop))

    onTabHidden(() => {
      if (option(props, 'completeOnTabHidden')) layout.timeline?.complete()
    })

    onBeforeUpdate(() => {
      if (!props.deps) layout.record()
    })

    onUpdated(() => {
      if (!props.deps) layout.animate?.()
    })

    return () => h(option(props, 'tag') ?? 'div', { ref: root, [LAYOUT_GROUP_ATTRIBUTE]: id }, slots.default?.())
  },
  {
    name: 'AnimeLayoutGroup',
    props: {
      tag: { type: String, default: undefined },
      deps: null,
      shallow: { type: Boolean, default: undefined },
      elements: null,
      layoutOptions: null,
      completeOnTabHidden: { type: Boolean, default: undefined },
    },
  },
)
