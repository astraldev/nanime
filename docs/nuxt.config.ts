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
    url: 'https://nanimejs.netlify.app',
  },
  mdc: {
    highlight: {
      noApiRoute: false,
    },
  },
  routeRules: {
    '/composables': { redirect: { to: '/composables/introduction', statusCode: 301 } },
    '/getting-started': { redirect: { to: '/getting-started/introduction', statusCode: 301 } },
    '/misc': { redirect: { to: '/composables/utilities', statusCode: 301 } },
    '/misc/introduction': { redirect: { to: '/composables/utilities', statusCode: 301 } },
    '/misc/easings': { redirect: { to: '/composables/utilities', statusCode: 301 } },
    '/misc/utils': { redirect: { to: '/composables/utilities', statusCode: 301 } },
    '/misc/proxies': { redirect: { to: '/composables/utilities#proxies', statusCode: 301 } },
    '/components': { redirect: { to: '/components/transitions', statusCode: 301 } },
    '/examples': { redirect: { to: '/examples/introduction', statusCode: 301 } },
    '/examples/timeline-storyboard': { redirect: { to: '/examples/introduction', statusCode: 301 } },
    '/examples/text-scatter': { redirect: { to: '/examples/introduction', statusCode: 301 } },
    '/changes': { redirect: { to: '/changes/changelog', statusCode: 301 } },
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
      routes: ['/', '/404.html'],
      crawlLinks: true,
      failOnError: false,
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
  llms: {
    domain: 'https://nanimejs.netlify.app',
  },
  sitemap: {
    autoLastmod: true,
    defaults: { changefreq: 'weekly', priority: 0.7 },
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
