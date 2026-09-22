import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'
import { defineVitestProject } from '@nuxt/test-utils/config'

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'unit',
          include: ['test/unit/*.{test,spec}.ts'],
          environment: 'node',
        },
      },
      {
        test: {
          name: 'e2e',
          include: ['test/e2e/*.{test,spec}.ts'],
          environment: 'node',
        },
      },
      await defineVitestProject({
        test: {
          name: 'full-nuxt-apps',
          include: ['test/fixtures/**/*.{test,spec}.ts'],
          environment: 'nuxt',
        },
      }),
      await defineVitestProject({
        test: {
          name: 'config',
          include: ['test/config/**/*.{test,spec}.ts'],
          environment: 'nuxt',
          environmentOptions: {
            nuxt: {
              rootDir: fileURLToPath(new URL('./test/fixtures/keep-time', import.meta.url)),
            },
          },
        },
      }),
      await defineVitestProject({
        test: {
          name: 'suites',
          include: ['test/suites/**/*.{test,spec}.ts'],
          environment: 'nuxt',
        },
      }),
    ],
  },
})
