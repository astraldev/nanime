import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  modules: ['../src/module', '@vueuse/nuxt', '@nuxt/icon'],
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  devServer: {
    port: 3002,
  },
  compatibilityDate: 'latest',
  vite: {
    plugins: [tailwindcss()],
  },
})
