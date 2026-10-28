import { build } from 'tsdown'
import vueConfig from './build/tsdown.vue.config'

export default {
  hooks: {
    async 'rollup:done'() {
      await build({ ...vueConfig, config: false })
    },
  },
}
