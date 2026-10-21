import { onMounted } from 'vue'
import { tryOnScopeDispose } from './vue-helpers'

export function onTabHidden(callback: () => void) {
  const listener = () => {
    if (document.hidden) callback()
  }
  onMounted(() => document.addEventListener('visibilitychange', listener))
  tryOnScopeDispose(() => {
    if (typeof document !== 'undefined') document.removeEventListener('visibilitychange', listener)
  })
}
