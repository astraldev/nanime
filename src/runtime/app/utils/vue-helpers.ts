/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCurrentInstance, getCurrentScope, isRef, onMounted, onScopeDispose, reactive, readonly, ref, unref, warn, type ComponentPublicInstance, type MaybeRef, type Ref, type UnwrapNestedRefs } from 'vue'

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

/** Warns in development when a composable that needs a component runs outside one. */
export function warnOutsideComponent(name: string) {
  if (!getCurrentInstance()) warn(`[nanime] ${name}() does nothing outside a component. Call it in setup().`)
}

/** Registers a scope dispose hook when there is a scope to register it on. */
export function tryOnScopeDispose(fn: () => void): boolean {
  if (!getCurrentScope()) return false

  onScopeDispose(fn)
  return true
}

/** VueUse's toReactive, in-tree so the runtime carries no extra dependencies. */
export function toReactive<T extends object>(objectRef: Ref<T>): UnwrapNestedRefs<T> {
  const proxy = new Proxy({}, {
    get(_, p, receiver) {
      return unref(Reflect.get(objectRef.value, p, receiver))
    },
    set(_, p, value) {
      const current = (objectRef.value as any)[p]
      if (isRef(current) && !isRef(value)) current.value = value
      else (objectRef.value as any)[p] = value
      return true
    },
    deleteProperty(_, p) {
      return Reflect.deleteProperty(objectRef.value, p)
    },
    has(_, p) {
      return Reflect.has(objectRef.value, p)
    },
    ownKeys() {
      return Object.keys(objectRef.value)
    },
    getOwnPropertyDescriptor() {
      return {
        enumerable: true,
        configurable: true,
      }
    },
  })

  return reactive(proxy) as UnwrapNestedRefs<T>
}
