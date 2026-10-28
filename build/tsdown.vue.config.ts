import { fileURLToPath } from 'node:url'
import { defineConfig } from 'tsdown'
import { sharedConfig } from './shared/tsdown.ts'

const nuxtShim = fileURLToPath(new URL('./vue/nuxt-shim.ts', import.meta.url))

export default defineConfig({
  ...sharedConfig('vue', '../vue/tsconfig.json'),
  entry: { index: fileURLToPath(new URL('./vue/index.ts', import.meta.url)) },
  unbundle: true,
  css: { inject: true },
  alias: {
    '#imports': nuxtShim,
    'nuxt/schema': nuxtShim,
  },
  define: {
    __NANIME_TRACK_TARGETS_ONLY__: JSON.stringify('off'),
  },
})
