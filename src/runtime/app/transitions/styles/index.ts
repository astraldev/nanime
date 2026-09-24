import type { AnimeTransitionStyle } from '../../public/types'
import { fade } from './fade'
import { scale } from './scale'
import { slideDown, slideLeft, slideRight, slideUp } from './slide'
import { swap } from './swap'

export const builtinTransitionStyles = {
  'fade': fade,
  'slide-up': slideUp,
  'slide-down': slideDown,
  'slide-left': slideLeft,
  'slide-right': slideRight,
  'scale': scale,
  'swap': swap,
} satisfies Record<string, AnimeTransitionStyle>
