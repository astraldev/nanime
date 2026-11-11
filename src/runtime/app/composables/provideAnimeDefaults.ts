import { computed, inject, provide, toValue, type MaybeRefOrGetter } from 'vue'
import type { NanimeDefaults } from '../public/types'
import { PROVIDED_DEFAULTS } from '../utils/config'

/**
 * Sets default props for the nanime components, and default parameters for
 * the composables, used inside this component.
 *
 * Each entry (`transition`, `transitionGroup`, `layoutGroup`) replaces the
 * same entry from an outer `provideAnimeDefaults()` call as a whole, and the
 * entries for other components are kept. Within an entry, each prop is
 * merged over the one in `nanime.components` in `app.config.ts`. A prop
 * passed to the component still wins. An entry set to `undefined` keeps the
 * outer one, and a prop set to `undefined` falls back to `app.config.ts`.
 * Values are never merged any deeper: `layoutOptions` and animation params
 * replace the lower ones whole.
 *
 * `composables.animate` and `composables.draggable` work the same way, each
 * replacing the outer one whole and falling back to `nanime.composables`.
 * Parameters passed to the composable call win.
 *
 * `rebuild` is the default for the composables inside, below a composable's
 * own `rebuild` option and above `app.config.ts`.
 *
 * `preset` swaps the preset for everything inside, replacing the one set higher
 * up or in `nanime.preset` in `app.config.ts`. A preset is the lowest layer,
 * below the props, this call and `app.config.ts`.
 */
export function provideAnimeDefaults(defaults: MaybeRefOrGetter<NanimeDefaults>) {
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
      preset: own.preset ?? above?.preset,
      rebuild: own.rebuild ?? above?.rebuild,
      composables: {
        animate: own.composables?.animate ?? above?.composables?.animate,
        draggable: own.composables?.draggable ?? above?.composables?.draggable,
      },
    } satisfies Record<keyof NanimeDefaults, unknown>
  }))
}
