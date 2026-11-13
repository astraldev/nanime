<script setup lang="ts">
const props = defineProps<{
  date?: string
}>()

const label = computed(() => props.date
  ? new Date(`${props.date}T00:00:00Z`).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' })
  : 'Unreleased')
</script>

<template>
  <time
    :datetime="props.date"
    class="block text-sm text-muted"
  >{{ label }}</time>
</template>
