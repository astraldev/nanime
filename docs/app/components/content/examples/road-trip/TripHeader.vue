<script setup lang="ts">
import { stagger } from '#nanime/utils'

const disabledActions = [
  { label: 'Oct 14 – 18', icon: 'i-ph-calendar-blank' },
  { label: '2 travellers', icon: 'i-ph-users' },
  { label: 'Share', icon: 'i-ph-share-network' },
]

const riseParams = {
  y: ['100%', '0%'],
  duration: 600,
  delay: stagger(18),
  ease: 'out(3)',
}

const fadeParams = {
  opacity: [0, 1],
  y: [6, 0],
  duration: 400,
  delay: 350,
  ease: 'out(3)',
}

const title = useTemplateRef('title')
const meta = useTemplateRef('meta')
const { chars } = useSplitText(title, { chars: { wrap: 'clip' } })

useAnimate(chars, riseParams)
useAnimate(meta, fadeParams)
</script>

<template>
  <header class="flex flex-wrap items-end justify-between gap-4 border-b border-default px-5 py-5">
    <div class="flex flex-col gap-1.5">
      <h2
        ref="title"
        class="text-2xl font-semibold text-highlighted sm:text-3xl"
      >
        Coast to Canyon
      </h2>
      <p
        ref="meta"
        class="text-sm text-muted"
      >
        4 stops · 620 km · 5 days
      </p>
    </div>
    <div class="flex flex-wrap gap-2">
      <button
        v-for="action in disabledActions"
        :key="action.label"
        type="button"
        disabled
        title="Not part of this example"
        class="flex items-center gap-1.5 rounded-lg border border-default px-3 py-1.5 text-sm text-muted disabled:cursor-not-allowed disabled:opacity-40"
      >
        <UIcon
          :name="action.icon"
          class="size-4"
        />
        {{ action.label }}
      </button>
    </div>
  </header>
</template>
