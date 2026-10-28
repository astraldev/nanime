import { warn } from 'vue'
import { builtinTransitionStyles } from './styles'
import { useNanimeConfig } from '../utils/config'
import { useActivePreset } from '../utils/active-preset'
import type { AnimationParams, AnimeMoveParams, AnimeTransitionStyle, AnimeTransitionStyleName } from '../public/types'

type StylePart = keyof AnimeTransitionStyle

const builtins = new Map<string, AnimeTransitionStyle>(Object.entries(builtinTransitionStyles))
const warned = new Set<string>()

function findStyle(configured: Partial<Record<string, AnimeTransitionStyle>> | undefined, shared: Partial<Record<string, AnimeTransitionStyle>> | undefined, name: string): AnimeTransitionStyle | undefined {
  const style = configured?.[name] ?? shared?.[name] ?? builtins.get(name)
  if (!style && !warned.has(name)) {
    warned.add(name)
    warn(`[nanime] Unknown transition style "${name}", using the default animation.`)
  }
  return style
}

interface TransitionFallback {
  enter: AnimationParams
  leave: AnimationParams
  move?: AnimeMoveParams
}

export function useTransitionStyles(fallback: TransitionFallback) {
  const config = useNanimeConfig()
  const preset = useActivePreset()
  const named = <Part extends StylePart>(value: string, part: Part) => findStyle(config().transitions, preset()?.shared, value)?.[part]

  return {
    enter: (value?: AnimeTransitionStyleName | AnimationParams) =>
      (typeof value === 'string' ? named(value, 'enter') : value) ?? fallback.enter,
    leave: (value?: AnimeTransitionStyleName | AnimationParams) =>
      (typeof value === 'string' ? named(value, 'leave') : value) ?? fallback.leave,
    move: (value?: AnimeTransitionStyleName | AnimeMoveParams | false) =>
      value === false ? false : (typeof value === 'string' ? named(value, 'move') : value) ?? fallback.move,
  }
}
