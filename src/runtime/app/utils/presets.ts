import type {
  AnimeLayoutGroupProps,
  AnimeTransitionGroupProps,
  AnimeTransitionProps,
  AnimeTransitionStyle,
  NanimeComposableDefaults,
} from '../public/types'
import type { ConfigTransitionStyleName } from '../public/types/transitions'

type PresetStyleName<Shared extends string> = ConfigTransitionStyleName | Shared

/** A motion personality: the styles, component defaults and composable defaults it sets. */
export interface AnimationPreset<Shared extends string = string> {
  /** Custom transition styles the preset adds, by name. */
  shared?: Record<Shared, AnimeTransitionStyle>
  /** Default props for each component. */
  components: {
    /** Default props for `<AnimeTransition>`. */
    transition: AnimeTransitionProps<PresetStyleName<Shared>>
    /** Default props for `<AnimeTransitionGroup>`. */
    transitionGroup: Omit<AnimeTransitionGroupProps<PresetStyleName<Shared>>, 'deps'>
    /** Default props for `<AnimeLayoutGroup>`. */
    layout: Omit<AnimeLayoutGroupProps, 'deps' | 'elements'>
  }
  /** Default parameters for each composable. */
  composables: Partial<NanimeComposableDefaults>
}

/** Declares a preset, checking that the style names it uses are ones it defines or a built-in. */
export function defineAnimationPreset<const Shared extends string = never>(preset: AnimationPreset<Shared>): AnimationPreset<Shared> {
  return preset
}
