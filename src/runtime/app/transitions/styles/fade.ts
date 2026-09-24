import type { AnimeTransitionStyle } from '../../public/types'

export const fade: AnimeTransitionStyle = {
  enter: {
    opacity: [0, 1],
    duration: 300,
    ease: 'out(3)',
  },
  leave: {
    opacity: 0,
    duration: 200,
    ease: 'in(3)',
  },
}
