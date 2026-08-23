<script setup lang="ts">
const props = withDefaults(defineProps<{
  src: string
  /** Set false for preview + source link only. */
  code?: boolean
}>(), { code: true })

const { data: markdown } = await useAsyncData(
  `preview-${props.src}-${props.code}`,
  () => useCodeBlockPreview(props.src, props.code),
)
</script>

<template>
  <MDC
    v-if="markdown"
    :value="markdown"
  />
</template>
