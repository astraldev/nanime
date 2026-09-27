import { BaseTransition, defineComponent, h } from 'vue'
import type { AnimeTransitionProps } from '../public/types'
import { tryOnScopeDispose } from '../utils/vue-helpers'
import { useComponentDefaults } from '../utils/component-defaults'
import { createTransitionRunner } from '../transitions/runner'
import { useTransitionStyles } from '../transitions/resolve'

export type { AnimeTransitionMode, AnimeTransitionProps } from '../public/types'

export default defineComponent(
  (props: AnimeTransitionProps, { slots }) => {
    const { option } = useComponentDefaults('transition')
    const styles = useTransitionStyles()
    const runner = createTransitionRunner({
      enter: () => styles.enter(option(props, 'enterAnimation')),
      leave: () => styles.leave(option(props, 'leaveAnimation')),
    })

    tryOnScopeDispose(runner.dispose)

    return () => h(
      BaseTransition,
      { mode: option(props, 'mode'), appear: option(props, 'appear'), ...runner.hooks },
      slots,
    )
  },
  {
    name: 'AnimeTransition',
    props: {
      enterAnimation: null,
      leaveAnimation: null,
      mode: null,
      appear: { type: Boolean, default: undefined },
    },
  },
)
