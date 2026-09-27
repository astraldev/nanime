import { computed, inject, toValue, type InjectionKey, type MaybeRefOrGetter } from 'vue'
import { useAppConfig } from '#imports'
import type { NanimeComponentDefaults } from '../public/types'

type ComponentName = keyof NanimeComponentDefaults
type Defaults<Name extends ComponentName> = NonNullable<NanimeComponentDefaults[Name]>

export interface DefaultsLayer {
  parent: DefaultsLayer | null
  defaults: MaybeRefOrGetter<NanimeComponentDefaults>
}

export const COMPONENT_DEFAULTS: InjectionKey<DefaultsLayer> = Symbol('nanime-component-defaults')

export function assignDefined<T extends object>(target: Partial<T>, ...sources: (Partial<T> | undefined)[]): Partial<T> {
  for (const source of sources) {
    if (!source) continue
    for (const key in source) {
      const value = source[key]
      if (value !== undefined) target[key] = value
    }
  }
  return target
}

export function useComponentDefaults<Name extends ComponentName>(name: Name) {
  const appConfig = useAppConfig()
  const layer = inject(COMPONENT_DEFAULTS, null)

  const layers = computed(() => {
    const list: Defaults<Name>[] = []
    for (let current = layer; current; current = current.parent) {
      const provided = toValue(current.defaults)[name]
      if (provided) list.unshift(provided)
    }
    const configured = appConfig.nanime?.components?.[name]
    if (configured) list.unshift(configured)
    return list
  })

  const merged = computed(() => assignDefined<Defaults<Name>>({}, ...layers.value))

  function option<Props, Key extends keyof Defaults<Name> & keyof Props>(props: Props, key: Key) {
    return props[key] ?? merged.value[key]
  }

  return { layers, merged, option }
}
