<script setup lang="ts">
import { spring } from '#nanime/easings'
import ExampleWrapper from '~/components/shared/ExampleWrapper.vue'

const container = useTemplateRef('container')
const draggable = useTemplateRef('draggable')

useDraggable(draggable, {
  container: container,
  containerPadding: 4,
  releaseEase: spring({
    bounce: 0.65,
    duration: 400,
  }),
  x: {
    snap: (draggable) => {
      const hw = (draggable?.dragArea || [0, 0, 0, 0])[2]
      const results = [0, hw * 0.35, hw * 0.75]
      return results
    },
  },
})
</script>

<template>
  <ExampleWrapper>
    <div
      ref="container"
      class="relative border border-primary/20 rounded-md border-dashed h-12"
    >
      <div class="snap-positions">
        <div
          class="spot"
          style="--snap-x: 0%"
        >
          0%
        </div>
        <div
          class="spot"
          style="--snap-x: 35%"
        >
          35%
        </div>
        <div
          class="spot"
          style="--snap-x: 75%"
        >
          75%
        </div>
      </div>
      <div
        ref="draggable"
        class="simple-box w-12 h-10!"
      />
    </div>
  </ExampleWrapper>
</template>

<style scoped>
@reference "~/assets/css/main.css";

.snap-positions {
  @apply absolute inset-1 pointer-events-none;
}

.snap-positions div {
  @apply absolute top-0 inset-y-0 left-(--snap-x);
}
</style>
