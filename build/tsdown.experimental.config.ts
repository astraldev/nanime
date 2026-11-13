import { fileURLToPath } from 'node:url'
import { defineConfig } from 'tsdown'
import { sharedConfig } from './shared/tsdown'

export default defineConfig({
  ...sharedConfig('experimental', '../experimental/tsconfig.json'),
  entry: { index: fileURLToPath(new URL('./experimental/index.ts', import.meta.url)) },
  unbundle: true,
})
