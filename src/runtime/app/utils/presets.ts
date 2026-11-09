import type {
  NanimeComponentDefaults,
  AnimeTransitionGroupProps,
  AnimeTransitionProps,
  AnimeTransitionStyle,
  NanimeComposableDefaults,
} from '../public/types'
import type { ConfigTransitionStyleName } from '../public/types/transitions'

type PresetStyleName<Shared extends string> = ConfigTransitionStyleName | Shared

type WithoutDeps<Props> = Props extends unknown ? Omit<Props, 'deps'> : never

/** A motion personality: the styles, component defaults and composable defaults it sets. */
export interface AnimationPreset<Shared extends string = string> {
  /** Custom transition styles the preset adds, by name. */
  shared?: Record<Shared, AnimeTransitionStyle>
  /** Default props for each component. */
  components: {
    /** Default props for `<AnimeTransition>`. */
    transition: AnimeTransitionProps<PresetStyleName<Shared>>
    /** Default props for `<AnimeTransitionGroup>`. */
    transitionGroup: WithoutDeps<AnimeTransitionGroupProps<PresetStyleName<Shared>>>
    /** Default props for `<AnimeLayoutGroup>`. */
    layoutGroup: NonNullable<NanimeComponentDefaults['layoutGroup']>
  }
  /** Default parameters for each composable. */
  composables: Partial<NanimeComposableDefaults>
}

/** Declares a preset, checking that the style names it uses are ones it defines or a built-in. */
export function defineAnimationPreset<const Shared extends string = never>(preset: AnimationPreset<Shared>): AnimationPreset<Shared> {
  return preset
}
