import { hasInjectionContext, inject } from 'vue'
import type { AnimationParams, WAAPIAnimationParams } from 'animejs'
import type { AnimeMoveParams, NanimeComponentDefaults, NanimeComposableDefaults } from '../public/types'
import type { TransitionParams } from '../transitions/engine'
import type { TransitionPart } from '../transitions/resolve'
import { PROVIDED_DEFAULTS, useNanimeConfig } from './config'
import { useActivePreset } from './active-preset'

type ComponentName = keyof NanimeComponentDefaults
type Defaults<Name extends ComponentName> = NonNullable<NanimeComponentDefaults[Name]>

interface AnimationLayer<Params extends object> {
  animation?: string | {
    enter?: string | Params
    leave?: string | Params
    move?: string | AnimeMoveParams | false
  }
  enterAnimation?: string | Params
  leaveAnimation?: string | Params
  moveAnimation?: string | AnimeMoveParams | false
}

type AnimationOptions
  = | (AnimationLayer<AnimationParams> & { waapi?: false })
    | (AnimationLayer<AnimationParams & WAAPIAnimationParams> & { waapi: true })
    | (AnimationLayer<never> & { waapi?: boolean })

interface ResolvedAnimation {
  enter?: TransitionPart
  leave?: TransitionPart
  move?: string | AnimeMoveParams | false
}

function splitLayer<Params extends object>(options: AnimationLayer<Params> | undefined, tag: (params: Params) => TransitionParams): ResolvedAnimation {
  const part = (value: string | Params | undefined) => typeof value === 'object' ? tag(value) : value
  const animation = options?.animation
  if (typeof animation === 'string') {
    return {
      enter: part(options?.enterAnimation) ?? animation,
      leave: part(options?.leaveAnimation) ?? animation,
      move: options?.moveAnimation ?? animation,
    }
  }
  return {
    enter: part(options?.enterAnimation ?? animation?.enter),
    leave: part(options?.leaveAnimation ?? animation?.leave),
    move: options?.moveAnimation ?? animation?.move,
  }
}

function splitAnimation(options: AnimationOptions | undefined): ResolvedAnimation {
  if (options?.waapi === true) return splitLayer(options, params => ({ engine: 'waapi', params }))
  return splitLayer(options, params => ({ engine: 'js', params }))
}

function animationDefaultsOf(defaults: NanimeComponentDefaults | undefined, name: ComponentName): AnimationOptions | undefined {
  if (name === 'transition') return defaults?.transition
  if (name === 'transitionGroup') return defaults?.transitionGroup
  return undefined
}

export function omitUndefined<Value extends object>(value: Value): Value {
  const copy: Value = { ...value }
  for (const key of Object.keys(copy)) {
    if (Reflect.get(copy, key) === undefined) Reflect.deleteProperty(copy, key)
  }
  return copy
}

export function useComposableDefaults<Name extends keyof NanimeComposableDefaults>(name: Name): () => NanimeComposableDefaults[Name] {
  const provided = hasInjectionContext() ? inject(PROVIDED_DEFAULTS, null) : null
  const config = useNanimeConfig()
  const preset = useActivePreset()

  return () => provided?.value.composables?.[name] ?? config().composables?.[name] ?? preset()?.composables[name]
}

export function useComponentDefaults<Name extends ComponentName>(name: Name) {
  const provided = hasInjectionContext() ? inject(PROVIDED_DEFAULTS, null) : null
  const config = useNanimeConfig()
  const preset = useActivePreset()

  function parseOption<Props, Key extends keyof Defaults<Name> & keyof Props>(props: Props, key: Key) {
    // the component's props
    const fromProps = props[key]
    // provideAnimeDefaults(): the closest call that sets this component
    const providerEntry: Partial<Defaults<Name>> | undefined = provided?.value[name]
    // nanime.components in app.config.ts
    const configEntry: Partial<Defaults<Name>> | undefined = config().components?.[name]
    // the active preset
    const presetEntry: Partial<Defaults<Name>> | undefined = preset()?.components[name]
    return fromProps ?? providerEntry?.[key] ?? configEntry?.[key] ?? presetEntry?.[key]
  }

  function parseAnimation(props: AnimationOptions): ResolvedAnimation {
    // Each source is split into enter, leave and move first, so a higher source wins per part.
    // the component's props
    const fromProps = splitAnimation(props)
    // provideAnimeDefaults(): the closest call that sets this component
    const fromProvider = splitAnimation(animationDefaultsOf(provided?.value, name))
    // nanime.components in app.config.ts
    const fromConfig = splitAnimation(animationDefaultsOf(config().components, name))
    // the active preset
    const fromPreset = splitAnimation(animationDefaultsOf(preset()?.components, name))
    return {
      enter: fromProps.enter ?? fromProvider.enter ?? fromConfig.enter ?? fromPreset.enter,
      leave: fromProps.leave ?? fromProvider.leave ?? fromConfig.leave ?? fromPreset.leave,
      move: fromProps.move ?? fromProvider.move ?? fromConfig.move ?? fromPreset.move,
    }
  }

  return { parseOption, parseAnimation }
}
