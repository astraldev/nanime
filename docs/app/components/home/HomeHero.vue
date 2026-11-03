<script setup lang="ts">
import { stagger } from 'animejs/utils'

const props = defineProps<{
  eyebrow?: string
  title: string
  pitch?: string
  install?: string
}>()

const copied = ref(false)
let copiedTimer: ReturnType<typeof setTimeout> | undefined

async function copyInstall() {
  if (!props.install) return
  try {
    await navigator.clipboard.writeText(props.install)
  }
  catch {
    return
  }
  copied.value = true
  clearTimeout(copiedTimer)
  copiedTimer = setTimeout(() => (copied.value = false), 1600)
}

onBeforeUnmount(() => clearTimeout(copiedTimer))

const entering = !useNuxtApp().isHydrating
  && import.meta.client
  && !matchMedia('(prefers-reduced-motion: reduce)').matches

const headline = useTemplateRef<HTMLElement>('headline')
const eyebrowEl = useTemplateRef<HTMLElement>('eyebrowEl')
const pitchEl = useTemplateRef<HTMLElement>('pitchEl')
const actionsEl = useTemplateRef<HTMLElement>('actionsEl')

if (entering) {
  const { words } = useSplitText(headline, { words: true })
  useAnimate(words, () => ({
    opacity: [0, 1],
    y: ['0.5em', 0],
    delay: stagger(60),
    duration: 650,
    ease: 'outQuart',
  }))
  useAnimate([eyebrowEl, pitchEl, actionsEl], {
    opacity: [0, 1],
    y: [12, 0],
    delay: stagger(90, { start: 420 }),
    duration: 500,
    ease: 'outQuart',
  })
}
</script>

<template>
  <section class="relative z-1 pt-[clamp(80px,12vw,160px)] pb-[clamp(96px,10vw,128px)]">
    <div class="mx-auto max-w-6xl px-6">
      <p
        v-if="props.eyebrow"
        ref="eyebrowEl"
        class="text-[0.95rem] font-medium text-primary"
        :class="{ 'opacity-0': entering }"
      >
        {{ props.eyebrow }}
      </p>
      <h1
        ref="headline"
        class="mt-6 max-w-[15ch] text-[clamp(2.8rem,7.4vw,5.6rem)] leading-[1.02] font-[650] tracking-[-0.035em] text-highlighted"
      >
        {{ props.title }}
      </h1>
      <p
        v-if="props.pitch"
        ref="pitchEl"
        class="mt-8 max-w-[56ch] text-[clamp(1.05rem,1.6vw,1.25rem)] leading-[1.7] text-muted"
        :class="{ 'opacity-0': entering }"
      >
        {{ props.pitch }}
      </p>

      <div
        ref="actionsEl"
        class="mt-12 flex flex-wrap items-center gap-3 max-sm:*:w-full"
        :class="{ 'opacity-0': entering }"
      >
        <div
          v-if="props.install"
          class="flex h-9 items-center gap-2.5 rounded-(--ui-radius) border border-accented ps-3 pe-1 font-mono text-sm max-sm:justify-between"
        >
          <span class="text-primary">$</span>
          <code>{{ props.install }}</code>
          <button
            type="button"
            class="grid size-7 cursor-pointer place-items-center rounded-md text-muted transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            :aria-label="copied ? 'Copied' : 'Copy install command'"
            @click="copyInstall"
          >
            <UIcon :name="copied ? 'i-ph-check' : 'i-ph-copy'" />
          </button>
          <span
            class="sr-only"
            role="status"
          >{{ copied ? 'Copied' : '' }}</span>
        </div>
        <slot />
      </div>
    </div>
  </section>
</template>
