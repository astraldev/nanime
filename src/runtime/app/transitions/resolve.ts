import type { AppConfig } from 'nuxt/schema'
import { warn } from 'vue'
import { useAppConfig } from '#imports'
import { builtinTransitionStyles } from './styles'
import { fade } from './styles/fade'
import type { AnimationParams, AnimeMoveParams, AnimeTransitionStyle, AnimeTransitionStyleName } from '../public/types'

type StylePart = keyof AnimeTransitionStyle
type PartParams<Part extends StylePart> = NonNullable<AnimeTransitionStyle[Part]>

const defaults: { [Part in StylePart]: PartParams<Part> } = {
  enter: fade.enter ?? {},
  leave: fade.leave ?? {},
  move: { duration: 400, ease: 'out(3)' },
}

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

export function useTransitionStyles() {
  const appConfig = useAppConfig()

  function resolve<Part extends StylePart>(value: AnimeTransitionStyleName | PartParams<Part> | undefined, part: Part) {
    if (typeof value !== 'string') return value ?? defaults[part]
    return findStyle(appConfig, value)?.[part] ?? defaults[part]
  }

  return {
    enter: (value?: AnimeTransitionStyleName | AnimationParams) => resolve(value, 'enter'),
    leave: (value?: AnimeTransitionStyleName | AnimationParams) => resolve(value, 'leave'),
    move: (value?: AnimeTransitionStyleName | AnimeMoveParams | false) => value === false ? false : resolve(value, 'move'),
  }
}
