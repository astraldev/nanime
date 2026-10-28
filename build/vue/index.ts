declare global {
  interface NanimeExperimentalLayoutOptions {
    trackTargetsOnly?: boolean
  }
}

export * from '../../src/runtime/app/public/composables'
export * from '../../src/runtime/app/public/types'
export * from '../../src/runtime/app/public/easings'
export * from '../../src/runtime/app/public/utils'
export * from '../../src/runtime/app/public/proxies/index'
export { default as AnimeTransition } from '../../src/runtime/app/components/AnimeTransition'
export { default as AnimeTransitionGroup } from '../../src/runtime/app/components/AnimeTransitionGroup'
export { default as AnimeLayoutGroup } from '../../src/runtime/app/components/AnimeLayoutGroup'
