import type { AnimeTransitionStyle } from './transitions'
import type { NanimeComponentDefaults } from './components'

/** The `nanime` key in `app.config.ts`. */
export interface NanimeAppConfig {
  /** Named transition styles. A name shared with a built-in replaces it. */
  transitions?: Record<string, AnimeTransitionStyle>
  /** Default props for each component. A prop passed to the component wins. */
  components?: NanimeComponentDefaults
}
