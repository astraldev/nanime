<script setup lang="ts">
const props = defineProps<{
  name: string
  to: string
  external?: boolean
}>()
</script>

<template>
  <NuxtLink
    :to="props.to"
    class="group relative flex flex-col gap-3 border-t border-default pt-7 pr-8 pb-8 transition-colors hover:border-primary"
    :target="props.external ? '_blank' : undefined"
    :rel="props.external ? 'noopener' : undefined"
  >
    <span
      class="text-[1.05rem] font-medium text-highlighted"
      :class="{ 'font-mono': /^(use|<)/.test(props.name) }"
    >{{ props.name }}</span>
    <span class="max-w-[44ch] text-base/[1.7] text-muted"><slot mdc-unwrap="p" /></span>
    <UIcon
      name="i-ph-arrow-up-right"
      class="absolute top-7 right-0 size-4.5 -translate-x-1.5 translate-y-1.5 text-primary opacity-0 transition group-hover:translate-0 group-hover:opacity-100"
    />
  </NuxtLink>
</template>
