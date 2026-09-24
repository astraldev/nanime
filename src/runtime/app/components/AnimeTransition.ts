import { BaseTransition, defineComponent, h } from 'vue'
import type { AnimationParams, AnimeTransitionStyleName } from '../public/types'
import { tryOnScopeDispose } from '../utils/vue-helpers'
import { createTransitionRunner } from '../transitions/runner'
import { useTransitionStyles } from '../transitions/resolve'

/** Order of the leave and enter animations when one element replaces another. */
export type AnimeTransitionMode = 'in-out' | 'out-in' | 'default'

export interface AnimeTransitionProps {
  /**
   * How the element appears: a transition style name, or Anime.js params.
   * @default 'fade'
   */
  enterAnimation?: AnimeTransitionStyleName | AnimationParams
  /**
   * How the element disappears: a transition style name, or Anime.js params.
   * @default 'fade'
   */
  leaveAnimation?: AnimeTransitionStyleName | AnimationParams
  /**
   * Order when one element replaces another. `out-in` waits for the old one to
   * leave before the new one enters.
   * @default 'default'
   */
  mode?: AnimeTransitionMode
  /**
   * Run the enter animation on the first render too.
   * @default false
   */
  appear?: boolean
}

export default defineComponent(
  (props: AnimeTransitionProps, { slots }) => {
    const styles = useTransitionStyles()
    const runner = createTransitionRunner({
      enter: () => styles.enter(props.enterAnimation),
      leave: () => styles.leave(props.leaveAnimation),
    })

    tryOnScopeDispose(runner.dispose)

    return () => h(BaseTransition, { mode: props.mode, appear: props.appear, ...runner.hooks }, slots)
  },
  {
    name: 'AnimeTransition',
    props: {
      enterAnimation: null,
      leaveAnimation: null,
      mode: null,
      appear: { type: Boolean, default: false },
    },
  },
)
