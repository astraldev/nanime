import type { AnimeTransitionStyle } from '../../public/types'

const slide = (axis: 'x' | 'y', distance: number): AnimeTransitionStyle => ({
  enter: {
    opacity: [0, 1],
    [axis]: [-distance, 0],
    duration: 350,
    ease: 'out(3)',
  },
  leave: {
    opacity: 0,
    [axis]: distance,
    duration: 250,
    ease: 'in(3)',
  },
})

export const slideUp = slide('y', -20)
export const slideDown = slide('y', 20)
export const slideLeft = slide('x', -20)
export const slideRight = slide('x', 20)
