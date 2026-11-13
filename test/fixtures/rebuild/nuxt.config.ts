import MyModule from '../../../src/module'

export default defineNuxtConfig({
  modules: [
    MyModule,
  ],
  nanime: {
    rebuild: 'restart',
  },
})
