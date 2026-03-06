import { computed, nextTick, ref, shallowRef, toValue, watchEffect, type ComputedRef, type MaybeRef, type MaybeRefOrGetter, type Ref } from 'vue'
import { splitText, type TextSplitter } from 'animejs/text'
import { normalizeSplitTextTarget } from '../utils/normalize-targets'
import { extractNonFunctionProperties, extractOnlyFunctionProperties, type NonFunctionProperties, type OnlyFunctionProperties } from '../utils/extract-props'
import { tryOnScopeDispose, useMounted } from '@vueuse/core'

type SplitText = {
  [x in 'lines' | 'words' | 'chars']: Ref<HTMLElement[]>
} & {
  properties: ComputedRef<NonFunctionProperties<TextSplitter> | undefined>
  methods: ComputedRef<OnlyFunctionProperties<TextSplitter> | undefined>
}

export function useSplitText(
  target: MaybeRef<Parameters<typeof normalizeSplitTextTarget>[0]>,
  parameters?: MaybeRefOrGetter<Parameters<typeof splitText>[1]>,
): SplitText {
  const mounted = useMounted()
  const splitter = ref<TextSplitter | null>(null)

  const lines = shallowRef<HTMLElement[]>([])
  const words = shallowRef<HTMLElement[]>([])
  const chars = shallowRef<HTMLElement[]>([])

  const syncArrays = () => {
    if (!splitter.value) return
    lines.value = [...splitter.value.lines]
    words.value = [...splitter.value.words]
    chars.value = [...splitter.value.chars]
  }

  watchEffect(() => {
    if (!mounted.value) return
    const element = normalizeSplitTextTarget(toValue(target))
    if (!element) return

    if (splitter.value) splitter.value.revert()
    const newSplitter = splitText(element, toValue(parameters))
    splitter.value = newSplitter

    newSplitter.addEffect(() => {
      syncArrays()
      return () => {}
    })

    nextTick(syncArrays)
  })

  tryOnScopeDispose(() => {
    splitter.value?.revert()
    splitter.value = null
    lines.value = []
    words.value = []
    chars.value = []
  })

  return {
    lines,
    words,
    chars,
    properties: computed(() => splitter.value ? extractNonFunctionProperties(splitter.value) : undefined),
    methods: computed(() => splitter.value ? extractOnlyFunctionProperties(splitter.value) : undefined),
  }
}
