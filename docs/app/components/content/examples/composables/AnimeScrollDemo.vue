<script setup lang="ts">
import ExampleWrapper from '~/components/shared/ExampleWrapper.vue'

const panel = useTemplateRef('panel')
const track = useTemplateRef('track')
const box = useTemplateRef('box')

const scroll = useAnimeScroll({
  container: panel,
  target: track,
  axis: 'x',
  enter: 'left left',
  leave: 'right right',
  sync: true,
})

useAnimate(box, {
  rotate: 360,
  ease: 'linear',
  autoplay: scroll,
})
</script>

<template>
  <ExampleWrapper>
    <div
      ref="panel"
      class="h-24 w-full overflow-x-auto overscroll-x-contain rounded-lg border border-primary/20"
    >
      <div
        ref="track"
        class="flex h-full w-[1600px] items-center"
      >
        <div
          ref="box"
          class="sticky left-4 size-10 rounded-lg bg-primary"
        />
      </div>
    </div>
  </ExampleWrapper>
</template>
