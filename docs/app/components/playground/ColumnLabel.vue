<script setup lang="ts">
defineProps<{
  badge: string
  name: string
  highlighted: boolean
}>()
</script>

<template>
  <div class="flex items-center gap-2">
    <UBadge
      :label="badge"
      :color="highlighted ? 'primary' : 'neutral'"
      variant="subtle"
    />
    <span class="text-sm">{{ name }}</span>
  </div>
</template>
