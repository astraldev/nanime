import type { AppConfig } from 'nuxt/schema'
import { warn } from 'vue'
import { useAppConfig } from '#imports'
import { builtinTransitionStyles } from './styles'
import type { AnimationParams, AnimeMoveParams, AnimeTransitionStyle, AnimeTransitionStyleName } from '../public/types'

type StylePart = keyof AnimeTransitionStyle

const builtins = new Map<string, AnimeTransitionStyle>(Object.entries(builtinTransitionStyles))
const warned = new Set<string>()

function findStyle(appConfig: AppConfig, name: string): AnimeTransitionStyle | undefined {
  const configured: Record<string, AnimeTransitionStyle> | undefined = appConfig.nanime?.transitions
  const style = configured?.[name] ?? builtins.get(name)
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
  const appConfig = useAppConfig()
  const named = <Part extends StylePart>(value: string, part: Part) => findStyle(appConfig, value)?.[part]

  return {
    enter: (value?: AnimeTransitionStyleName | AnimationParams) =>
      (typeof value === 'string' ? named(value, 'enter') : value) ?? fallback.enter,
    leave: (value?: AnimeTransitionStyleName | AnimationParams) =>
      (typeof value === 'string' ? named(value, 'leave') : value) ?? fallback.leave,
    move: (value?: AnimeTransitionStyleName | AnimeMoveParams | false) =>
      value === false ? false : (typeof value === 'string' ? named(value, 'move') : value) ?? fallback.move,
  }
}
