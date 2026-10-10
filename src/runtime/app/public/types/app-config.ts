import type { AnimeTransitionStyle } from './transitions'
import type { NanimeComponentDefaults } from './components'
import type { NanimeReducedMotion } from './options'

/** The `nanime` key in `app.config.ts`. */
export interface NanimeAppConfig {
  /** Overrides `reducedMotion` from `nuxt.config.ts`, and can change at runtime. */
  reducedMotion?: NanimeReducedMotion
  /** Named transition styles. A name shared with a built-in replaces it. */
  transitions?: Record<string, AnimeTransitionStyle>
  /** Default props for each component. A prop passed to the component wins. */
  components?: NanimeComponentDefaults
}
