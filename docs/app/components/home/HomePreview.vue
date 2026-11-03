<script setup lang="ts">
const box = useTemplateRef('box')
useAnimate(box, { x: 200, alternate: true, loop: true })
</script>

<template>
  <div class="flex flex-col overflow-hidden rounded-md border border-muted">
    <div class="flex items-center gap-1.5 border-b border-muted bg-default h-12 px-4 text-sm/6 text-default">
      <UIcon
        name="i-ph-play"
        class="size-4 shrink-0"
      />
      <span>Preview</span>
    </div>
    <div class="flex flex-1 items-center bg-muted px-6 py-6">
      <div
        ref="box"
        class="size-12 rounded-md bg-primary"
      />
    </div>
  </div>
</template>
