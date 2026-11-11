<script setup lang="ts">
const props = defineProps<{
  shown: boolean
  slideX: number
}>()

const slider = useTemplateRef('slider')
const track = useTemplateRef('track')
const handle = useTemplateRef('handle')

useAnimate(slider, () => ({ x: props.slideX }), { rebuild: 'keepValue' })
useDraggable(handle, { container: track, y: false })
</script>

<template>
  <div class="flex flex-wrap gap-x-8 gap-y-4 font-mono text-xs">
    <div class="flex flex-col gap-2">
      <span>AnimeTransition</span>
      <div class="size-10">
        <AnimeTransition animation="scale">
          <div
            v-if="shown"
            class="size-10 rounded-lg bg-primary"
          />
        </AnimeTransition>
      </div>
    </div>
    <div class="flex flex-col gap-2">
      <span>useAnimate</span>
      <div class="w-40">
        <div
          ref="slider"
          class="size-10 rounded-lg bg-primary"
        />
      </div>
    </div>
    <div class="flex flex-col gap-2">
      <span>useDraggable</span>
      <div
        ref="track"
        class="relative h-10 w-40 bg-primary/10"
      >
        <div
          ref="handle"
          class="relative size-10 cursor-grab rounded-lg bg-primary"
        />
      </div>
    </div>
  </div>
</template>
