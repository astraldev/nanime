<script setup lang="ts">
defineProps<{
  file: string
  href: string
}>()
</script>

<template>
  <div class="flex flex-col overflow-hidden rounded-md border border-muted">
    <div class="flex h-12 items-center justify-between gap-1.5 border-b border-muted bg-default px-4 text-sm/6 text-default">
      <span class="flex items-center gap-1.5">
        <UIcon
          name="i-vscode-icons-file-type-vue"
          class="size-4 shrink-0"
        />
        {{ file }}
      </span>
      <a
        :href="href"
        target="_blank"
        rel="noopener"
        class="flex items-center gap-1 text-xs text-muted hover:text-default"
      >
        <UIcon
          name="i-simple-icons-github"
          class="size-3.5"
        />
        Show on GitHub
      </a>
    </div>
    <div class="flex-1 [&_button]:hidden [&_pre]:my-0! [&_pre]:h-full [&_pre]:rounded-none! [&_pre]:border-0! [&>div]:my-0! [&>div]:h-full [&_div]:rounded-none! [&_div]:border-0!">
      <slot />
    </div>
  </div>
</template>
