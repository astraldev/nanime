<script setup lang="ts">
const route = useRoute()
</script>

<template>
  <nav class="flex items-center gap-1">
    <UButton
      v-for="link of headerLinks"
      :key="link.to"
      :to="link.to"
      :label="link.label"
      color="neutral"
      variant="ghost"
      :class="inSection(route.path, link.section) ? 'text-highlighted' : 'text-muted'"
    />
  </nav>
</template>
