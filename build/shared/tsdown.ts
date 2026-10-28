import { fileURLToPath } from 'node:url'
import type { UserConfig } from 'tsdown'

export function sharedConfig(outDir: string, tsconfig: string): UserConfig {
  return {
    outDir: fileURLToPath(new URL(`../../dist/${outDir}`, import.meta.url)),
    clean: false,
    format: 'esm',
    fixedExtension: true,
    platform: 'neutral',
    tsconfig: fileURLToPath(new URL(tsconfig, import.meta.url)),
    dts: true,
  }
}
