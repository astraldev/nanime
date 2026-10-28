import { fileURLToPath } from 'node:url'
import { defineConfig } from 'tsdown'

const nuxtShim = fileURLToPath(new URL('./vue/nuxt-shim.ts', import.meta.url))

export default defineConfig({
  entry: { index: fileURLToPath(new URL('./vue/index.ts', import.meta.url)) },
  outDir: fileURLToPath(new URL('../dist/vue', import.meta.url)),
  clean: false,
  format: 'esm',
  fixedExtension: true,
  platform: 'neutral',
  unbundle: true,
  tsconfig: fileURLToPath(new URL('./vue/tsconfig.json', import.meta.url)),
  dts: true,
  css: { inject: true },
  alias: {
    '#imports': nuxtShim,
    'nuxt/schema': nuxtShim,
  },
  define: {
    __NANIME_TRACK_TARGETS_ONLY__: JSON.stringify('off'),
  },
})
