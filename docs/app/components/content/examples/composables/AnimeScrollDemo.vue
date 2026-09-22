<script setup lang="ts">
import { createDrawable } from '#nanime/proxies/svg'
import type { DrawableSVGGeometry } from '#nanime/types'
import ExampleWrapper from '~/components/shared/ExampleWrapper.vue'

const THREAD = 'M 0 100 C 300 20 560 180 860 100 S 1420 18 1720 104 S 2150 192 2300 120'

const panel = useTemplateRef<HTMLElement>('panel')
const track = useTemplateRef<HTMLElement>('track')
const thread = useTemplateRef<SVGPathElement>('thread')

const scroll = useAnimeScroll(() => ({
  container: panel.value ?? undefined,
  target: track.value ?? undefined,
  axis: 'x',
  enter: 'left left',
  leave: 'right right',
  sync: true,
}))

const drawable = computed<DrawableSVGGeometry | null>(() =>
  thread.value ? createDrawable(thread.value)[0] ?? null : null,
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
      class="w-full h-56 overflow-x-auto overscroll-x-contain rounded-lg border border-primary/20 bg-primary/5"
    >
      <div
        ref="track"
        class="relative w-[2400px] h-full flex items-center"
      >
        <svg
          viewBox="0 0 2400 200"
          class="w-[2400px] h-[200px] text-primary"
        >
          <path
            :d="THREAD"
            class="stroke-current/15"
            fill="none"
            stroke-width="3"
            stroke-linecap="round"
          />
          <path
            ref="thread"
            :d="THREAD"
            class="stroke-current"
            fill="none"
            stroke-width="3"
            stroke-linecap="round"
          />
        </svg>

        <Icon
          name="lucide:lightbulb"
          class="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 size-10 text-primary"
          style="left: 2300px"
        />
      </div>
    </div>
  </ExampleWrapper>
</template>
