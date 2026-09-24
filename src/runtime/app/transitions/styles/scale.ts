import type { AnimeTransitionStyle } from '../../public/types'

export const scale: AnimeTransitionStyle = {
  enter: {
    opacity: [0, 1],
    scale: [0.85, 1],
    duration: 300,
    ease: 'out(3)',
  },
  leave: {
    opacity: 0,
    scale: 0.85,
    duration: 200,
    ease: 'in(3)',
  },
}
