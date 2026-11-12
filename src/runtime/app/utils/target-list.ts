import { isReactive, isRef, shallowReactive, toRaw, watch, type Ref } from 'vue'

const isWritableRef = (value: unknown): value is Ref<unknown> => isRef(value)

export function trackTargetList(target: unknown) {
  const raw = toRaw(target)
  if (!isWritableRef(raw)) return

  watch(() => raw.value, (value) => {
    if (Array.isArray(value) && !isReactive(value)) raw.value = shallowReactive(value)
  }, { immediate: true, flush: 'sync' })
}
