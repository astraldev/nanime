import { hasInjectionContext, inject, type ComputedRef, type InjectionKey } from 'vue'
import type { AnimationParams } from 'animejs'
import { useAppConfig } from '#imports'
import type { AnimeMoveParams, NanimeComponentDefaults, NanimeComposableDefaults, NanimeDefaults } from '../public/types'

type ComponentName = keyof NanimeComponentDefaults
type Defaults<Name extends ComponentName> = NonNullable<NanimeComponentDefaults[Name]>

interface AnimationOptions {
  animation?: string | ResolvedAnimation
  enterAnimation?: string | AnimationParams
  leaveAnimation?: string | AnimationParams
  moveAnimation?: string | AnimeMoveParams | false
}

interface ResolvedAnimation {
  enter?: string | AnimationParams
  leave?: string | AnimationParams
  move?: string | AnimeMoveParams | false
}

export const PROVIDED_DEFAULTS: InjectionKey<ComputedRef<NanimeDefaults>> = Symbol('nanime-provided-defaults')

function splitAnimation(options: AnimationOptions | undefined): ResolvedAnimation {
  const animation = options?.animation
  if (typeof animation === 'string') {
    return {
      enter: options?.enterAnimation ?? animation,
      leave: options?.leaveAnimation ?? animation,
      move: options?.moveAnimation ?? animation,
    }
  }
  return {
    enter: options?.enterAnimation ?? animation?.enter,
    leave: options?.leaveAnimation ?? animation?.leave,
    move: options?.moveAnimation ?? animation?.move,
  }
}

function animationDefaultsOf(defaults: NanimeComponentDefaults | undefined, name: ComponentName): AnimationOptions | undefined {
  if (name === 'transition') return defaults?.transition
  if (name === 'transitionGroup') return defaults?.transitionGroup
  return undefined
}

export function useComposableDefaults<Name extends keyof NanimeComposableDefaults>(name: Name): () => NanimeComposableDefaults[Name] {
  const appConfig = useAppConfig()
  const provided = hasInjectionContext() ? inject(PROVIDED_DEFAULTS, null) : null

  return () => provided?.value.composables?.[name] ?? appConfig.nanime?.composables?.[name]
}

export function useComponentDefaults<Name extends ComponentName>(name: Name) {
  const appConfig = useAppConfig()
  const provided = inject(PROVIDED_DEFAULTS, null)

  function parseOption<Props, Key extends keyof Defaults<Name> & keyof Props>(props: Props, key: Key) {
    // the component's props
    const fromProps = props[key]
    // provideAnimeDefaults(): the closest call that sets this component
    const providerEntry: Partial<Defaults<Name>> | undefined = provided?.value[name]
    // nanime.components in app.config.ts
    const configEntry: Partial<Defaults<Name>> | undefined = appConfig.nanime?.components?.[name]
    return fromProps ?? providerEntry?.[key] ?? configEntry?.[key]
  }

  function parseAnimation(props: AnimationOptions): ResolvedAnimation {
    // Each source is split into enter, leave and move first, so a higher source wins per part.
    // the component's props
    const fromProps = splitAnimation(props)
    // provideAnimeDefaults(): the closest call that sets this component
    const fromProvider = splitAnimation(animationDefaultsOf(provided?.value, name))
    // nanime.components in app.config.ts
    const fromConfig = splitAnimation(animationDefaultsOf(appConfig.nanime?.components, name))
    return {
      enter: fromProps.enter ?? fromProvider.enter ?? fromConfig.enter,
      leave: fromProps.leave ?? fromProvider.leave ?? fromConfig.leave,
      move: fromProps.move ?? fromProvider.move ?? fromConfig.move,
    }
  }

  return { parseOption, parseAnimation }
}
