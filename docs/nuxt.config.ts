export default defineNuxtConfig({
  extends: ['docus'],
  modules: ['nanime'],
  $development: {
    modules: ['nuxt-studio'],
    hooks: {
      'build:manifest': (manifest) => {
        for (const chunk of Object.values(manifest)) chunk.prefetch = false
      },
    },
    studio: {
      dev: true,
      repository: {
        provider: 'github',
        owner: 'astraldev',
        repo: 'nanime',
        branch: 'main',
      },
    },
  },
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
        { name: 'theme-color', content: '#252423' },
      ],
      script: [
        {
          tagPosition: 'head',
          innerHTML: '(function(){var c=[\'red\',\'corail\',\'orange\',\'yellow\',\'citrus\',\'lime\',\'green\',\'turquoise\',\'cyan\',\'sky\',\'sega\',\'king\',\'indigo\',\'lavender\',\'purple\',\'magenta\',\'pink\'];document.documentElement.style.setProperty(\'--color-primary\',\'var(--hex-\'+c[Math.floor(Math.random()*c.length)]+\'-1)\')})()',
        },
        {
          tagPosition: 'head',
          innerHTML: '(function(){var d=document.documentElement;if(!document.fonts)return;d.classList.add(\'fonts-wait\');var done=function(){d.classList.remove(\'fonts-wait\')};setTimeout(done,1500);document.addEventListener(\'DOMContentLoaded\',function(){Promise.all([400,500,600,700].map(function(w){return document.fonts.load(w+\' 1em Geom\')})).then(done,done)})})()',
        },
      ],
      style: [
        { innerHTML: '.fonts-wait body{visibility:hidden}' },
      ],
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: '48x48' },
        { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
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
    '/guides': { redirect: { to: '/guides/configuration', statusCode: 301 } },
    '/guides/how-composables-run': { redirect: { to: '/composables/how-composables-run', statusCode: 301 } },
    '/getting-started/configuration': { redirect: { to: '/guides/configuration', statusCode: 301 } },
    '/getting-started/presets': { redirect: { to: '/guides/presets', statusCode: 301 } },
    '/getting-started/performance': { redirect: { to: '/guides/performance', statusCode: 301 } },
    '/getting-started/accessibility': { redirect: { to: '/guides/accessibility', statusCode: 301 } },
    '/getting-started/vue': { redirect: { to: '/guides/vue', statusCode: 301 } },
    '/misc': { redirect: { to: '/composables/utilities', statusCode: 301 } },
    '/misc/introduction': { redirect: { to: '/composables/utilities', statusCode: 301 } },
    '/misc/easings': { redirect: { to: '/composables/utilities', statusCode: 301 } },
    '/misc/utils': { redirect: { to: '/composables/utilities', statusCode: 301 } },
    '/misc/proxies': { redirect: { to: '/composables/utilities#proxies', statusCode: 301 } },
    '/components': { redirect: { to: '/components/transition', statusCode: 301 } },
    '/components/transitions': { redirect: { to: '/components/transition', statusCode: 301 } },
    '/examples': { redirect: { to: '/examples/drive', statusCode: 301 } },
    '/examples/timeline-storyboard': { redirect: { to: '/examples/drive', statusCode: 301 } },
    '/examples/text-scatter': { redirect: { to: '/examples/drive', statusCode: 301 } },
    '/examples/drag-to-bin': { redirect: { to: '/examples/drive', statusCode: 301 } },
    '/examples/media-library': { redirect: { to: '/examples/drive', statusCode: 301 } },
    '/examples/loading-sequence': { redirect: { to: '/examples/road-trip', statusCode: 301 } },
    '/examples/scroll-road-trip': { redirect: { to: '/examples/road-trip', statusCode: 301 } },
    '/changes': { redirect: { to: '/changes/changelog', statusCode: 301 } },
    '/comparisons': { redirect: { to: '/comparisons/vs-nuxt-modules', statusCode: 301 } },
    '/getting-started/vs-nuxt-modules': { redirect: { to: '/comparisons/vs-nuxt-modules', statusCode: 301 } },
    '/getting-started/vs-vue-packages': { redirect: { to: '/comparisons/vs-vue-packages', statusCode: 301 } },
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
  icon: {
    customCollections: [{ prefix: 'nanime', dir: './app/assets/icons' }],
    clientBundle: {
      scan: true,
      icons: [
        'simple-icons:npm',
        'vscode-icons:file-type-npm',
        'vscode-icons:file-type-pnpm',
        'vscode-icons:file-type-yarn',
        'vscode-icons:file-type-bun',
        'vscode-icons:file-type-typescript',
        'vscode-icons:file-type-vue',
        'vscode-icons:file-type-js',
        'vscode-icons:file-type-css',
        'vscode-icons:file-type-node',
        'vscode-icons:file-type-nuxt',
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
})
