export default defineNuxtConfig({
  extends: ['docus'],
  modules: ['nanime'],
  css: ['./app/assets/css/main.css'],
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
