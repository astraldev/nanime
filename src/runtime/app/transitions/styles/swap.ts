import type { AnimeTransitionStyle } from '../../public/types'

export const swap: AnimeTransitionStyle = {
  enter: {
    opacity: [0, 1],
    y: [10, 0],
    scale: [0.97, 1],
    duration: 260,
    ease: 'out(4)',
  },
  leave: {
    opacity: 0,
    y: -10,
    scale: 0.97,
    duration: 160,
    ease: 'in(2)',
  },
}
