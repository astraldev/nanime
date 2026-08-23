export default defineNuxtConfig({
  extends: ['docus'],
  modules: ['nuxt-studio', 'nanime'],
  components: {
    global: true,
    dirs: ['~/components'],
  },
  app: {
    head: {
      meta: [
        {
          name: 'google-site-verification',
          content: 'k2rdqKBTN2zz6nvGRTA4DbeY0SUcq6lkEemQ_597FZs',
        },
      ],
    },
  },
  css: ['~/assets/css/main.css'],
  site: {
    name: 'nanime',
  },
  sourcemap: {
    server: false,
    client: false,
  },
  devServer: {
    port: 3001,
  },
  nitro: {
    prerender: {
      routes: ['/'],
      crawlLinks: true,
    },
  },
  vite: {
    optimizeDeps: {
      include: [
        '@vue/devtools-core',
        '@vue/devtools-kit',
        'remark-emoji',
        'remark-mdc',
      ],
    },
  },
  studio: {
    // @ts-expect-error from the docs
    git: {
      commit: {
        messagePrefix: 'content:',
      },
    },
    repository: {
      provider: 'github',
      owner: 'astraldev',
      repo: 'nanime',
      branch: process.env.STUDIO_BRANCH_NAME || 'main',
    },
  },
})
