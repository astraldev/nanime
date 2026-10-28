import { build } from 'tsdown'
import vueConfig from './build/tsdown.vue.config'
import presetsConfig from './build/tsdown.presets.config'

export default {
  hooks: {
    async 'rollup:done'() {
      await build({ ...vueConfig, config: false })
      await build({ ...presetsConfig, config: false })
    },
  },
}
