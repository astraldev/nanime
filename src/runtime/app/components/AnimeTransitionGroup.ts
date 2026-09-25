import { createLayout, type AutoLayout } from 'animejs/layout'
import { TransitionGroup, cloneVNode, defineComponent, getCurrentInstance, getTransitionRawChildren, h, onBeforeUpdate, onUpdated, type VNode } from 'vue'
import type { AnimationParams, AnimeMoveParams, AnimeTransitionStyleName } from '../public/types'
import { tryOnScopeDispose } from '../utils/vue-helpers'
import { createTransitionRunner } from '../transitions/runner'
import { useTransitionStyles } from '../transitions/resolve'

export interface AnimeTransitionGroupProps {
  /**
   * Element rendered around the items.
   * @default 'div'
   */
  tag?: string
  /**
   * How items appear: a transition style name, or Anime.js params.
   * @default 'fade'
   */
  enterAnimation?: AnimeTransitionStyleName | AnimationParams
  /**
   * How items disappear: a transition style name, or Anime.js params.
   * @default 'fade'
   */
  leaveAnimation?: AnimeTransitionStyleName | AnimationParams
  /**
   * How items move to a new position: a transition style name,
   * `{ duration, delay, ease }`, or `false` to skip moves.
   * @default { duration: 400, ease: 'out(3)' }
   */
  moveAnimation?: AnimeTransitionStyleName | AnimeMoveParams | false
  /**
   * Run the enter animation on the first render too.
   * @default false
   */
  appear?: boolean
  /**
   * Take leaving items out of the flow as soon as they start leaving, so the
   * rest close the gap while they animate out.
   * @default true
   */
  absoluteLeave?: boolean
}

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
    const styles = useTransitionStyles()
    const enterParams = () => styles.enter(props.enterAnimation)
    const leaveParams = () => styles.leave(props.leaveAnimation)
    const moveParams = () => styles.move(props.moveAnimation)
    const transitionStyles = () => animatedStyles([enterParams(), leaveParams()])

    let layout: AutoLayout | null = null

    const leavesToPin = new Map<HTMLElement, Styles>()
    const pinnedOriginals = new WeakMap<Element, Styles>()

    let hiddenFromMove = new Set<Element>()
    const endedDuringMove = new Map<StyledElement, Styles>()

    const runner = createTransitionRunner({
      enter: enterParams,
      leave: leaveParams,
      onLeaveStart(el) {
        if (props.absoluteLeave && el instanceof HTMLElement && el.offsetParent) leavesToPin.set(el, pinnedStyles(el))
      },
      onEnd(el) {
        if (hiddenFromMove.has(el)) endedDuringMove.set(el, readStyles(el, transitionStyles()))
        if (el instanceof HTMLElement) leavesToPin.delete(el)
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
      hiddenFromMove = new Set()
      endedDuringMove.clear()
    }

    onBeforeUpdate(() => {
      const root = instance?.subTree.el
      if (moveParams() === false || !(root instanceof HTMLElement)) return dropLayout()
      if (layout?.root !== root) dropLayout()
      runLayout(root, () => {
        layout ??= createLayout(root, { enterFrom: {}, leaveTo: {} })
        layout.record()
      })
    })

    onUpdated(() => {
      pinLeavingItems()
      const current = layout
      const move = moveParams()
      if (!current || move === false) return
      const { duration, delay, ease } = move
      const onComplete = () => {
        restoreEndedDuringMove()
        runner.refresh()
      }
      runLayout(current.root, () => current.animate({ duration, delay, ease, onComplete }))
      hiddenFromMove = new Set(runner.running())
      endedDuringMove.clear()
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

    return () => {
      const children = getTransitionRawChildren(slots.default?.() ?? []).map(trackMount)
      runner.expectLeaving(takeLeaving(new Set(children.map(child => child.key))))
      return h(
        TransitionGroup,
        { tag: props.tag, css: false, moveClass: 'anime-move', appear: props.appear, ...runner.hooks },
        { default: () => children },
      )
    }
  },
  {
    name: 'AnimeTransitionGroup',
    props: {
      tag: { type: String, default: 'div' },
      enterAnimation: null,
      leaveAnimation: null,
      moveAnimation: null,
      appear: { type: Boolean, default: false },
      absoluteLeave: { type: Boolean, default: true },
    },
  },
)
