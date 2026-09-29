import { computed, nextTick, shallowRef, toValue, warn, watch, watchEffect, type ComputedRef, type MaybeRef, type MaybeRefOrGetter, type Ref } from 'vue'
import { splitText, type TextSplitter } from 'animejs/text'
import { normalizeSplitTextTarget } from '../utils/targets'
import {
  extractNonFunctionProperties,
  extractOnlyFunctionProperties,
  omitProperties,
  type NonFunctionProperties,
  type OnlyFunctionProperties,
} from '../utils/extract-props'
import { tryOnScopeDispose, useMounted } from '../utils/vue-helpers'
import { snapshotParameters } from '../utils/snapshot-parameters'
import type { SplitTextOptions } from '../public/types'

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

/**
 * Splits the text of `target` into lines, words and chars with Anime.js
 * `splitText()`, and restores the original text when the scope is disposed.
 *
 * `lines`, `words` and `chars` are refs that update each time the text is
 * split again. For text that changes, pass it as `options.html` instead of
 * rendering it in the template.
 */
export function useSplitText(
  target: MaybeRef<Parameters<typeof normalizeSplitTextTarget>[0]>,
  parameters?: MaybeRefOrGetter<Parameters<typeof splitText>[1]>,
  options?: SplitTextOptions,
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

  const readHtmlOption = () => options?.html === undefined ? undefined : toValue(options.html)
  const resolveHtml = () => {
    const html = readHtmlOption()
    return typeof html === 'string' ? html : undefined
  }

  if (options?.html !== undefined) {
    watchEffect(() => {
      const html = readHtmlOption()
      if (typeof html !== 'string') warn(`[nanime] useSplitText: the html option is ${String(html)}, so the current text is kept.`)
    })
  }

  const resyncSource = (instance: TextSplitter) => {
    const element = instance.$target
    if (!element || resolveHtml() !== undefined) return
    const produced = instance.chars[0] || instance.words[0] || instance.lines[0]
    if (produced && element.contains(produced)) return
    instance.html = element.innerHTML
    instance.cache = ''
  }

  const resolveTarget = () => normalizeSplitTextTarget(toValue(target))
  const resolveParameters = () => toValue(parameters)

  const rebuildSplitter = (element: HTMLElement, params: ReturnType<typeof resolveParameters>) => {
    if (splitter.value) {
      resyncSource(splitter.value)
      splitter.value.revert()
    }

    const html = resolveHtml()
    if (html !== undefined) element.innerHTML = html
    const newSplitter = splitText(element, params)
    splitter.value = newSplitter

    newSplitter.addEffect(() => {
      syncArrays()
      return () => {}
    })
    for (const effect of userEffects) newSplitter.addEffect(effect)

    nextTick(syncArrays)
  }

  const teardown = () => {
    if (splitter.value) {
      resyncSource(splitter.value)
      splitter.value.revert()
    }
    splitter.value = null
    lines.value = []
    words.value = []
    chars.value = []
  }

  watch(
    [
      mounted,
      resolveTarget,
      () => {
        const params = resolveParameters()
        return params && snapshotParameters(params)
      },
    ],
    ([isMounted, target]) => {
      if (!isMounted) return
      const element = typeof target === 'string' ? document.querySelector(target) : target
      if (!(element instanceof HTMLElement)) {
        teardown()
        return
      }
      rebuildSplitter(element, resolveParameters())
    },
    { immediate: true },
  )

  watch(resolveHtml, (html) => {
    if (!splitter.value || html === undefined || splitter.value.html === html) return
    splitter.value.html = html
    splitter.value.refresh()
  })

  const refresh = () => {
    if (!splitter.value) return
    resyncSource(splitter.value)
    splitter.value.split(true)
  }

  tryOnScopeDispose(teardown)

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
