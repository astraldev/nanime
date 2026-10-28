import { BaseTransition, defineComponent, h } from 'vue'
import type { AnimeTransitionProps } from '../public/types'
import { tryOnScopeDispose } from '../utils/vue-helpers'
import { onTabHidden } from '../utils/tab-hidden'
import { useComponentDefaults } from '../utils/component-defaults'
import { createTransitionRunner } from '../transitions/runner'
import { useTransitionStyles } from '../transitions/resolve'
import { fade } from '../transitions/styles/fade'

export type { AnimeTransitionMode, AnimeTransitionProps } from '../public/types'

export default defineComponent(
  (props: AnimeTransitionProps, { slots }) => {
    const { parseAnimation, parseOption } = useComponentDefaults('transition')
    const styles = useTransitionStyles(fade)
    const runner = createTransitionRunner({
      enter: () => styles.enter(parseAnimation(props).enter),
      leave: () => styles.leave(parseAnimation(props).leave),
    })

    onTabHidden(() => {
      if (parseOption(props, 'completeOnTabHidden')) runner.complete()
    })

    tryOnScopeDispose(runner.dispose)

    return () => h(
      BaseTransition,
      { mode: parseOption(props, 'mode'), appear: parseOption(props, 'appear'), ...runner.hooks },
      slots,
    )
  },
  {
    name: 'AnimeTransition',
    props: {
      animation: null,
      enterAnimation: null,
      leaveAnimation: null,
      mode: null,
      appear: { type: Boolean, default: undefined },
      completeOnTabHidden: { type: Boolean, default: undefined },
    },
  },
)
