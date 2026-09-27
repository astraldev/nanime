import type { AutoLayout, LayoutAnimationParams } from 'animejs/layout'
import type { Timeline } from 'animejs'
import { LAYOUT_ANIMATING_ATTRIBUTE } from './markers'

type PinnedStyle = 'box-sizing' | 'line-height'

export function markLayoutAnimations<Layout extends AutoLayout>(layout: Layout): Layout {
  const record = layout.record.bind(layout)
  const animate = layout.animate.bind(layout)
  const revert = layout.revert.bind(layout)
  const root = layout.root
  let pinned: [HTMLElement, PinnedStyle, string][] = []

  function pin(element: HTMLElement, property: PinnedStyle, value: string) {
    pinned.push([element, property, element.style.getPropertyValue(property)])
    element.style.setProperty(property, value)
  }

  function pinSizedNodes() {
    layout.newState.nodes.forEach(({ $el, measuredDisplay }) => {
      if (!($el instanceof HTMLElement) || !$el.style.width) return
      pin($el, 'box-sizing', 'border-box')
      if (measuredDisplay === 'inline' && $el.style.position === 'absolute') pin($el, 'line-height', $el.style.height)
    })
  }

  function release() {
    root.removeAttribute(LAYOUT_ANIMATING_ATTRIBUTE)
    for (const [element, property, value] of pinned) {
      if (value) element.style.setProperty(property, value)
      else element.style.removeProperty(property)
    }
    pinned = []
  }

  layout.record = () => {
    record()
    release()
    return layout
  }

  layout.revert = () => {
    revert()
    release()
    return layout
  }

  layout.animate = (params: LayoutAnimationParams = {}) => {
    release()
    const onComplete = params.onComplete ?? layout.params.onComplete
    const timeline = animate({
      ...params,
      onComplete: (self: Timeline) => {
        release()
        onComplete?.(self)
      },
    })
    if (!timeline.completed) {
      root.setAttribute(LAYOUT_ANIMATING_ATTRIBUTE, '')
      pinSizedNodes()
    }
    return timeline
  }

  return layout
}
