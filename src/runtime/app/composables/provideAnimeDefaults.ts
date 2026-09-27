import { inject, provide, type MaybeRefOrGetter } from 'vue'
import type { NanimeComponentDefaults } from '../public/types'
import { COMPONENT_DEFAULTS } from '../utils/component-defaults'

/**
 * Sets default props for the nanime components rendered below this component.
 * Merges per prop over outer `provideAnimeDefaults()` calls and
 * `nanime.components` in `app.config.ts`. A prop passed to the component wins,
 * and an `undefined` value leaves the outer default in place.
 */
export function provideAnimeDefaults(defaults: MaybeRefOrGetter<NanimeComponentDefaults>) {
  provide(COMPONENT_DEFAULTS, { parent: inject(COMPONENT_DEFAULTS, null), defaults })
}
