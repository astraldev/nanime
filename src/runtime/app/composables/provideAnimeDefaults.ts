import { computed, inject, provide, toValue, type MaybeRefOrGetter } from 'vue'
import type { NanimeComponentDefaults } from '../public/types'
import { PROVIDED_DEFAULTS } from '../utils/component-defaults'

/**
 * Sets default props for the nanime components rendered inside this
 * component.
 *
 * Each entry (`transition`, `transitionGroup`, `layoutGroup`) replaces the
 * same entry from an outer `provideAnimeDefaults()` call as a whole, and the
 * entries for other components are kept. Within an entry, each prop is
 * merged over the one in `nanime.components` in `app.config.ts`. A prop
 * passed to the component still wins. An entry set to `undefined` keeps the
 * outer one, and a prop set to `undefined` falls back to `app.config.ts`.
 * Values are never merged any deeper: `layoutOptions` and animation params
 * replace the lower ones whole.
 */
export function provideAnimeDefaults(defaults: MaybeRefOrGetter<NanimeComponentDefaults>) {
  const outer = inject(PROVIDED_DEFAULTS, null)
  provide(PROVIDED_DEFAULTS, computed(() => {
    // this call
    const own = toValue(defaults)
    // the provideAnimeDefaults() calls further out, already combined
    const above = outer?.value
    return {
      transition: own.transition ?? above?.transition,
      transitionGroup: own.transitionGroup ?? above?.transitionGroup,
      layoutGroup: own.layoutGroup ?? above?.layoutGroup,
    } satisfies Record<keyof NanimeComponentDefaults, unknown>
  }))
}
