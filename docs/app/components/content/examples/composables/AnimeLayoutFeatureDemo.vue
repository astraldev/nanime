<script setup lang="ts">
import ExampleWrapper from '~/components/shared/ExampleWrapper.vue'

const grid = useTemplateRef('grid')
const featured = ref(1)

const layout = useAnimeLayout(grid)

function feature(tile: number) {
  layout.patch(() => (featured.value = tile))
}
</script>

<template>
  <ExampleWrapper>
    <div
      ref="grid"
      class="grid w-full max-w-xs auto-rows-[3.5rem] grid-cols-4 gap-2"
    >
      <button
        v-for="tile in 6"
        :key="tile"
        type="button"
        class="rounded-lg bg-primary"
        :class="{ 'col-span-2 row-span-2': featured === tile }"
        :aria-label="`Feature tile ${tile}`"
        @click="feature(tile)"
      />
    </div>
  </ExampleWrapper>
</template>
