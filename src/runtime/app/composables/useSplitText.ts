import { computed, nextTick, shallowRef, toValue, watch, type ComputedRef, type MaybeRef, type MaybeRefOrGetter, type Ref } from 'vue'
import { splitText, type TextSplitter } from 'animejs/text'
import { normalizeSplitTextTarget } from '../utils/normalize-targets'
import {
  extractNonFunctionProperties,
  extractOnlyFunctionProperties,
  omitProperties,
  type NonFunctionProperties,
  type OnlyFunctionProperties,
} from '../utils/extract-props'
import { tryOnScopeDispose, useMounted } from '../utils/vue-helpers'

type SplitEffect = Parameters<TextSplitter['addEffect']>[0]

type SplitterMethods = Omit<OnlyFunctionProperties<TextSplitter>, 'addEffect'> & {
  addEffect: (effect: SplitEffect) => void
}

type SplitterProperties = Omit<NonFunctionProperties<TextSplitter>, 'lines' | 'words' | 'chars'>

type SplitText = {
  [x in 'lines' | 'words' | 'chars']: Ref<HTMLElement[]>
} & {
  properties: ComputedRef<SplitterProperties | undefined>
  methods: ComputedRef<SplitterMethods | undefined>
  refresh: () => void
}

export function useSplitText(
  target: MaybeRef<Parameters<typeof normalizeSplitTextTarget>[0]>,
  parameters?: MaybeRefOrGetter<Parameters<typeof splitText>[1]>,
): SplitText {
  const mounted = useMounted()
  const splitter = shallowRef<TextSplitter | null>(null)
  const version = shallowRef(0)
  const userEffects: SplitEffect[] = []

  const addEffect = (effect: SplitEffect) => {
    userEffects.push(effect)
    splitter.value?.addEffect(effect)
  }

  const lines = shallowRef<HTMLElement[]>([])
  const words = shallowRef<HTMLElement[]>([])
  const chars = shallowRef<HTMLElement[]>([])

  const syncArrays = () => {
    if (!splitter.value) return
    lines.value = [...splitter.value.lines]
    words.value = [...splitter.value.words]
    chars.value = [...splitter.value.chars]
    version.value++
  }

  const resyncSource = (instance: TextSplitter) => {
    const element = instance.$target
    if (!element) return
    const produced = instance.chars[0] || instance.words[0] || instance.lines[0]
    if (produced && element.contains(produced)) return
    instance.html = element.innerHTML
    instance.cache = ''
  }

  const resolveTarget = () => normalizeSplitTextTarget(toValue(target))
  const resolveParameters = () => toValue(parameters)

  const rebuildSplitter = (
    element: NonNullable<ReturnType<typeof resolveTarget>>,
    params: ReturnType<typeof resolveParameters>,
  ) => {
    if (splitter.value) {
      resyncSource(splitter.value)
      splitter.value.revert()
    }

    const newSplitter = splitText(element, params)
    splitter.value = newSplitter

    newSplitter.addEffect(() => {
      syncArrays()
      return () => {}
    })
    for (const effect of userEffects) newSplitter.addEffect(effect)

    nextTick(syncArrays)
  }

  watch(
    [
      mounted,
      resolveTarget,
      resolveParameters,
    ],
    ([isMounted, element, params]) => {
      if (!isMounted || !element) return
      rebuildSplitter(element, params)
    },
    { immediate: true },
  )

  const refresh = () => {
    if (!splitter.value) return
    resyncSource(splitter.value)
    splitter.value.split(true)
  }

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
    refresh,
    properties: computed(() => {
      void version.value
      if (!splitter.value) return undefined
      const properties = extractNonFunctionProperties(splitter.value)
      return omitProperties(properties, ['lines', 'words', 'chars'])
    }),
    methods: computed(() => {
      if (!splitter.value) return undefined
      return { ...extractOnlyFunctionProperties(splitter.value), addEffect }
    }),
  }
}
