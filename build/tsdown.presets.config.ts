import { fileURLToPath } from 'node:url'
import { defineConfig } from 'tsdown'
import { sharedConfig } from './shared/tsdown.ts'

export default defineConfig({
  ...sharedConfig('presets', '../presets/tsconfig.json'),
  entry: [fileURLToPath(new URL('./presets/*.ts', import.meta.url))],
})
