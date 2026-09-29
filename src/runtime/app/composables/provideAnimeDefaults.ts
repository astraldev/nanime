import { inject, provide, type MaybeRefOrGetter } from 'vue'
import type { NanimeComponentDefaults } from '../public/types'
import { COMPONENT_DEFAULTS } from '../utils/component-defaults'

/**
 * Sets default props for the nanime components rendered inside this
 * component.
 *
 * Each prop is merged over outer `provideAnimeDefaults()` calls and
 * `nanime.components` in `app.config.ts`. A prop passed to the component
 * still wins, and an `undefined` value keeps the outer default.
 */
export function provideAnimeDefaults(defaults: MaybeRefOrGetter<NanimeComponentDefaults>) {
  provide(COMPONENT_DEFAULTS, { parent: inject(COMPONENT_DEFAULTS, null), defaults })
}
