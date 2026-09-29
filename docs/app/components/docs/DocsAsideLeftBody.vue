<script setup lang="ts">
const items = useSidebarNavigation()
const contentNavVariants = useUIConfig('contentNavigation')
</script>

<template>
  <UContentNavigation
    :collapsible="false"
    :highlight="contentNavVariants.highlight ?? true"
    :highlight-color="contentNavVariants.highlightColor"
    :variant="contentNavVariants.variant ?? 'link'"
    :color="contentNavVariants.color"
    :navigation="items"
  />
</template>
