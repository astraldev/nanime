import type { AnimeTransitionStyle } from '../../public/types'

export const transitionGroupStyle = {
  enter: {
    opacity: [0, 1],
    duration: 250,
    ease: 'out(3)',
  },
  leave: {
    opacity: 0,
    duration: 150,
    ease: 'in(3)',
  },
  move: {
    duration: 350,
    ease: 'out(3)',
  },
} satisfies Required<AnimeTransitionStyle>
