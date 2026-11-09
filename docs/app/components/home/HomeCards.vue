<script setup lang="ts">
defineProps<{ pair?: boolean }>()
</script>

<template>
  <div
    :class="pair ? 'lg:grid-cols-2' : 'lg:grid-cols-3'"
    class="grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2 [&_pre]:my-0 [&_pre]:whitespace-pre! *:my-0! [&>div:has(>pre)]:flex [&>div:has(>pre)]:flex-col [&>div>pre]:flex-1"
  >
    <slot />
  </div>
</template>
