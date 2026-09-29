<script setup lang="ts">
const { heading = 'h2', align = 'left' } = defineProps<{
  title?: string
  text?: string
  heading?: 'h1' | 'h2'
  align?: 'left' | 'right'
}>()
</script>

<!-- One screen tall including its padding: the scroll timelines count in sections. -->
<template>
  <div
    class="relative z-2 mx-auto box-content h-[calc(100vh-20vmin)] w-[calc(100vw-20vmin)] p-[10vmin]"
    :class="{ 'text-right': align === 'right' }"
  >
    <component
      :is="heading"
      v-if="title"
      class="inline text-[8vw] font-bold text-highlighted max-[500px]:text-[40px] min-[800px]:text-[64px]"
    >
      {{ title }}
    </component>
    <p
      v-if="text"
      class="my-[1em]"
    >
      {{ text }}
    </p>
    <slot />
  </div>
</template>
