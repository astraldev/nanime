<script setup lang="ts">
import { createDrawable } from '#nanime/proxies/svg'
import type { DrawableSVGGeometry } from '#nanime/types'
import ExampleWrapper from '~/components/shared/ExampleWrapper.vue'

const panel = useTemplateRef('panel')
const track = useTemplateRef('track')
const thread = useTemplateRef<SVGPathElement>('thread')

const scroll = useAnimeScroll({
  container: panel,
  target: track,
  axis: 'x',
  enter: 'left left',
  leave: 'right right',
  sync: true,
})

const drawable = computed<DrawableSVGGeometry | null>(
  () => thread.value ? createDrawable(thread.value)[0] ?? null : null,
)

useAnimate([drawable], {
  draw: ['0 0', '0 1'],
  ease: 'linear',
  autoplay: scroll,
})
</script>

<template>
  <ExampleWrapper>
    <div
      ref="panel"
      class="h-56 w-full overflow-x-auto overscroll-x-contain rounded-lg border border-primary/20"
    >
      <div
        ref="track"
        class="relative flex h-full w-[2400px] items-center text-primary"
      >
        <svg
          viewBox="0 0 2400 200"
          class="h-[200px] w-full"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
        >
          <path
            class="opacity-15"
            d="M 0 100 C 300 20 560 180 860 100 S 1420 18 1720 104 S 2150 192 2300 120"
          />
          <path
            ref="thread"
            d="M 0 100 C 300 20 560 180 860 100 S 1420 18 1720 104 S 2150 192 2300 120"
          />
        </svg>
        <Icon
          name="lucide:lightbulb"
          class="absolute left-[2300px] top-1/2 size-10 -translate-x-1/2 -translate-y-1/2"
        />
      </div>
    </div>
  </ExampleWrapper>
</template>
