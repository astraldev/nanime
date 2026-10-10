import { createLayout, type AutoLayout } from 'animejs/layout'
import { TransitionGroup, cloneVNode, defineComponent, getCurrentInstance, getTransitionRawChildren, h, nextTick, onUpdated, type VNode } from 'vue'
import type { AnimationParams, AnimeTransitionGroupProps } from '../public/types'
import { tryOnScopeDispose } from '../utils/vue-helpers'
import { useComponentDefaults } from '../utils/component-defaults'
import { watchDeps } from '../utils/deps'
import { markLayoutAnimations } from '../utils/layout-animations'
import { isMotionReduced } from '../utils/reduced-motion'
import { MOVE_CLASS } from '../utils/markers'
import { createTransitionRunner } from '../transitions/runner'
import { useTransitionStyles } from '../transitions/resolve'
import { transitionGroupStyle } from '../transitions/styles/group'

export type { AnimeTransitionGroupProps } from '../public/types'

type StyledElement = HTMLElement | SVGElement
type Styles = Record<string, string>

const BASE_STYLES = ['transform']

const toKebab = (prop: string) => prop.replace(/[A-Z]/g, char => `-${char.toLowerCase()}`)

function animatedStyles(params: AnimationParams[]): string[] {
  const probe = typeof document === 'undefined' ? null : document.documentElement.style
  const animated = params.flatMap(Object.keys).filter(key => probe && key in probe).map(toKebab)
  return [...new Set([...BASE_STYLES, ...animated])]
}

const readStyles = (el: StyledElement, props: string[]): Styles =>
  Object.fromEntries(props.map(prop => [prop, el.style.getPropertyValue(prop)]))

function setStyles(el: StyledElement, styles: Styles): Styles {
  const previous: Styles = {}
  for (const [prop, value] of Object.entries(styles)) {
    previous[prop] = el.style.getPropertyValue(prop)
    el.style.setProperty(prop, value)
  }
  return previous
}

function readLeafDisplays(root: Element) {
  return [...root.querySelectorAll('*')].flatMap(el => el instanceof HTMLElement && !el.firstElementChild
    ? [{ el, value: el.style.getPropertyValue('display'), priority: el.style.getPropertyPriority('display') }]
    : [])
}

const pinnedStyles = (el: HTMLElement): Styles => ({
  'position': 'absolute',
  'left': `${el.offsetLeft}px`,
  'top': `${el.offsetTop}px`,
  'width': `${el.offsetWidth}px`,
  'height': `${el.offsetHeight}px`,
  'margin': '0px',
  'box-sizing': 'border-box',
})

export default defineComponent(
  (props: AnimeTransitionGroupProps, { slots }) => {
    const instance = getCurrentInstance()
    const { option } = useComponentDefaults('transitionGroup')
    const styles = useTransitionStyles(transitionGroupStyle)
    const enterParams = () => styles.enter(option(props, 'enterAnimation'))
    const leaveParams = () => styles.leave(option(props, 'leaveAnimation'))
    const moveParams = () => isMotionReduced() ? false : styles.move(option(props, 'moveAnimation'))
    const absoluteLeave = () => option(props, 'absoluteLeave') ?? true
    const transitionStyles = () => animatedStyles([enterParams(), leaveParams()])

    let layout: AutoLayout | null = null
    let recorded = false

    const leavesToPin = new Map<StyledElement, Styles>()
    const pinnedOriginals = new WeakMap<Element, Styles>()

    let hiddenFromMove = new Set<Element>()
    const endedDuringMove = new Map<StyledElement, Styles>()

    const runner = createTransitionRunner({
      enter: enterParams,
      leave: leaveParams,
      onLeaveStart(el) {
        if (absoluteLeave() && el instanceof HTMLElement && el.offsetParent) leavesToPin.set(el, pinnedStyles(el))
      },
      onEnd(el) {
        if (hiddenFromMove.has(el)) endedDuringMove.set(el, readStyles(el, transitionStyles()))
        leavesToPin.delete(el)
        const originals = pinnedOriginals.get(el)
        pinnedOriginals.delete(el)
        if (originals) setStyles(el, originals)
      },
    })

    function runLayout(root: Element, layoutCall: () => void) {
      const blank = Object.fromEntries(transitionStyles().map(prop => [prop, '']))
      const hidden = [...runner.running()].map(el => ({ el, styles: setStyles(el, blank) }))
      const leafDisplays = readLeafDisplays(root)
      layoutCall()
      for (const { el, styles } of hidden) setStyles(el, styles)
      for (const { el, value, priority } of leafDisplays) el.style.setProperty('display', value, priority)
      restoreEndedDuringMove()
    }

    function restoreEndedDuringMove() {
      endedDuringMove.forEach((styles, el) => setStyles(el, styles))
    }

    function pinLeavingItems() {
      for (const [el, styles] of leavesToPin) pinnedOriginals.set(el, setStyles(el, styles))
      leavesToPin.clear()
    }

    function dropLayout() {
      layout?.revert()
      layout = null
      recorded = false
      hiddenFromMove = new Set()
      endedDuringMove.clear()
    }

    function recordMoves() {
      const root = instance?.subTree.el
      if (!moveParams() || !(root instanceof HTMLElement)) return dropLayout()
      if (layout?.root !== root) dropLayout()
      runLayout(root, () => {
        layout ??= markLayoutAnimations(createLayout(root, { enterFrom: {}, leaveTo: {} }))
        layout.record()
      })
      recorded = true
    }

    function animateMoves() {
      const current = layout
      const move = moveParams()
      if (!recorded || !current || !move) return
      recorded = false
      const { duration, delay, ease } = move
      const onComplete = () => {
        restoreEndedDuringMove()
        runner.refresh()
      }
      runLayout(current.root, () => current.animate({ duration, delay, ease, onComplete }))
      hiddenFromMove = new Set(runner.running())
      endedDuringMove.clear()
    }

    watchDeps(() => props.deps, option(props, 'shallow') ?? false, () => {
      if (recorded) return
      recordMoves()
      nextTick(animateMoves)
    })

    onUpdated(() => {
      pinLeavingItems()
      animateMoves()
    })

    tryOnScopeDispose(() => {
      dropLayout()
      leavesToPin.clear()
      runner.dispose()
    })

    const mounted = new Map<VNode['key'], Element>()

    function trackMount(item: VNode) {
      return cloneVNode(item, {
        onVnodeMounted: (vnode: VNode) => {
          if (vnode.el instanceof Element) mounted.set(item.key, vnode.el)
        },
      })
    }

    function takeLeaving(keys: Set<VNode['key']>) {
      const leaving = [...mounted].filter(([key]) => !keys.has(key))
      leaving.forEach(([key]) => mounted.delete(key))
      return leaving
        .map(([, el]) => el)
        .sort((a, b) => a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1)
    }

    let keys: VNode['key'][] = []

    function keysChanged(next: VNode['key'][]) {
      const changed = next.length !== keys.length || next.some((key, index) => key !== keys[index])
      keys = next
      return changed
    }

    return () => {
      const children = getTransitionRawChildren(slots.default?.() ?? []).map(trackMount)
      const childKeys = children.map(child => child.key)
      const listChanged = keysChanged(childKeys)
      if (instance?.isMounted && !recorded && (listChanged || !props.deps)) recordMoves()
      runner.expectLeaving(takeLeaving(new Set(childKeys)))
      return h(
        TransitionGroup,
        {
          tag: option(props, 'tag') ?? 'div',
          css: false,
          moveClass: MOVE_CLASS,
          appear: option(props, 'appear'),
          ...runner.hooks,
        },
        { default: () => children },
      )
    }
  },
  {
    name: 'AnimeTransitionGroup',
    props: {
      tag: { type: String, default: undefined },
      enterAnimation: null,
      leaveAnimation: null,
      moveAnimation: null,
      appear: { type: Boolean, default: undefined },
      absoluteLeave: { type: Boolean, default: undefined },
      deps: null,
      shallow: { type: Boolean, default: undefined },
    },
  },
)
