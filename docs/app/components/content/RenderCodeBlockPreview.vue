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
  <div
    v-if="markdown"
    class="code-preview"
  >
    <MDC :value="markdown" />
  </div>
</template>
