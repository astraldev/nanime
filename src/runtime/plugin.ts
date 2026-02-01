import { defineNuxtPlugin } from '#app'
import * as utils from 'animejs/utils'

export default defineNuxtPlugin((_nuxtApp) => {
  return {
    provide: {
      anime: { utils },
    },
  }
})
