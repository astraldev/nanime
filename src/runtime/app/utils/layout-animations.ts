import type { AutoLayout, LayoutAnimationParams } from 'animejs/layout'
import type { Timeline } from 'animejs'
import { LAYOUT_ANIMATING_ATTRIBUTE } from './markers'

type PinnedStyle = 'box-sizing' | 'line-height' | 'position' | 'white-space'

function readOneLineTexts(root: Element) {
  const checked = new Set<HTMLElement>()
  const oneLine = new Set<HTMLElement>()
  const range = document.createRange()
  if (typeof range.getClientRects !== 'function') return oneLine
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  for (let text = walker.nextNode(); text; text = walker.nextNode()) {
    const parent = text.parentElement
    if (!(parent instanceof HTMLElement) || checked.has(parent) || !text.textContent?.trim()) continue
    checked.add(parent)
    range.selectNodeContents(parent)
    const lines = new Set([...range.getClientRects()].map(rect => Math.round(rect.top)))
    if (lines.size === 1) oneLine.add(parent)
  }
  return oneLine
}

export function markLayoutAnimations(layout: AutoLayout): AutoLayout {
  const record = layout.record.bind(layout)
  const animate = layout.animate.bind(layout)
  const revert = layout.revert.bind(layout)
  const root = layout.root
  let pinned: [HTMLElement, PinnedStyle, string][] = []

  function pin(element: HTMLElement, property: PinnedStyle, value: string) {
    pinned.push([element, property, element.style.getPropertyValue(property)])
    element.style.setProperty(property, value)
  }

  function pinSizedNodes(oneLineTexts: Set<HTMLElement>) {
    layout.newState.nodes.forEach(({ $el, measuredDisplay, measuredPosition, isInlined }) => {
      if (!($el instanceof HTMLElement) || !$el.style.width) return
      pin($el, 'box-sizing', 'border-box')
      if (measuredDisplay === 'inline' && $el.style.position === 'absolute') pin($el, 'line-height', $el.style.height)
      if (isInlined && $el !== root && $el.firstElementChild && measuredPosition === 'static') pin($el, 'position', 'relative')
      if (oneLineTexts.has($el)) pin($el, 'white-space', 'nowrap')
    })
  }

  function release() {
    for (const [element, property, value] of pinned) {
      if (value) element.style.setProperty(property, value)
      else element.style.removeProperty(property)
    }
    pinned = []
    if (!root.hasAttribute(LAYOUT_ANIMATING_ATTRIBUTE)) return
    root.getBoundingClientRect()
    root.removeAttribute(LAYOUT_ANIMATING_ATTRIBUTE)
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
    const oneLineTexts = readOneLineTexts(root)
    const onComplete = params.onComplete ?? layout.params.onComplete
    const timeline = animate({
      ...params,
      onComplete: (self: Timeline) => {
        release()
        onComplete?.(self)
      },
    })
    if (root.classList.contains('is-animated')) {
      root.setAttribute(LAYOUT_ANIMATING_ATTRIBUTE, '')
      pinSizedNodes(oneLineTexts)
    }
    return timeline
  }

  return layout
}
