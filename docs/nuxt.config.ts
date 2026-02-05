export default defineNuxtConfig({
  extends: ['docus'],
  modules: process.env.NODE_ENV === 'development' ? ['../src/module'] : ['nanime'],
  components: {
    global: true,
    dirs: ['~/components'],
  },
  css: ['./app/assets/css/main.css'],
  site: {
    name: 'nanime',
  },
  content: {
    build: {
      markdown: {
        highlight: {
          // @ts-expect-error type isn't properly inferred
          noApiRoute: false,
        },
      },
    },
  },
  sourcemap: {
    server: false,
    client: false
  },
  devServer: {
    port: 3001,
  },
  vite: {
    optimizeDeps: {
      include: [
        '@vue/devtools-core',
        '@vue/devtools-kit',
      ],
    },
  },
})
