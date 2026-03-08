import type { Plugin } from 'vue'
import Slide from '../../src/runtime/app/components/transition/Slide.vue'
import Scale from '../../src/runtime/app/components/transition/Scale.vue'

export { useAnimate } from '../../src/runtime/app/composables/useAnimate'
export { useAnimatable } from '../../src/runtime/app/composables/useAnimatable'
export { useDraggable } from '../../src/runtime/app/composables/useDraggable'
export { useAnimeLayout } from '../../src/runtime/app/composables/useLayout'
export { useSplitText } from '../../src/runtime/app/composables/useSplitText'
export { useWaapiAnimate } from '../../src/runtime/app/composables/useWaapiAnimate'
export { default as Slide } from '../../src/runtime/app/components/transition/Slide.vue'
export { default as Scale } from '../../src/runtime/app/components/transition/Scale.vue'

export interface AnimePluginOptions {
  /**
   * Prefix for components
   * @default 'A'
   */
  prefix?: string
}

const AnimePlugin: Plugin<AnimePluginOptions> = {
  install(app, options) {
    const prefix = options?.prefix ?? 'A'
    app.component(`${prefix}Slide`, Slide)
    app.component(`${prefix}Scale`, Scale)
  },
}

export { AnimePlugin }
