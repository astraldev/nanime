import { computed, toValue, watch } from 'vue'

const sameEntries = (next: readonly unknown[], prev: readonly unknown[]) =>
  next.length === prev.length && next.every((value, index) => Object.is(value, prev[index]))

export function watchDeps(source: () => readonly unknown[] | undefined, shallow: boolean, onChange: () => void) {
  const deps = computed<readonly unknown[] | undefined>((prev) => {
    const next = source()?.map(entry => toValue(entry))
    return next && prev && sameEntries(next, prev) ? prev : next
  })

  watch(
    deps,
    (next) => {
      if (next) onChange()
    },
    { flush: 'pre', deep: !shallow },
  )
}
