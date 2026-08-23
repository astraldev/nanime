import { getCurrentInstance, getCurrentScope, onMounted, onScopeDispose, readonly, ref, type ComponentPublicInstance, type MaybeRef, type Ref } from 'vue'

export type VueInstance = ComponentPublicInstance
export type MaybeElement = HTMLElement | SVGElement | VueInstance | undefined | null
export type MaybeElementRef<T extends MaybeElement = MaybeElement> = MaybeRef<T>

/** Tracks whether the calling component has mounted. Stays `false` on the server. */
export function useMounted(): Readonly<Ref<boolean>> {
  const isMounted = ref(false)
  const instance = getCurrentInstance()

  if (instance) {
    onMounted(() => {
      isMounted.value = true
    }, instance)
  }

  return readonly(isMounted)
}

/** Registers a scope dispose hook when there is a scope to register it on. */
export function tryOnScopeDispose(fn: () => void): boolean {
  if (!getCurrentScope()) return false

  onScopeDispose(fn)
  return true
}
