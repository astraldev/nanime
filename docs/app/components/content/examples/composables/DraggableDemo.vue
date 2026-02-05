<script setup lang="ts">
import ExampleWrapper from '~/components/shared/ExampleWrapper.vue'

const container = useTemplateRef<HTMLElement>('container')
const draggable = useTemplateRef<HTMLElement>('draggable')

useDraggable(draggable, {
  container: container,
  containerPadding: 4,
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
      class="relative border border-primary/20 rounded-md border-dashed h-10"
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
        class="simple-box w-12"
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
