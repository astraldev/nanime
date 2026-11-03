<script setup lang="ts">
const props = defineProps<{
  name: string
  to: string
  icons?: string
  external?: boolean
}>()

const iconList = computed(() => props.icons?.split(/\s+/).filter(Boolean) ?? [])
</script>

<template>
  <NuxtLink
    :to="props.to"
    class="group relative flex flex-col gap-3 rounded-md bg-elevated/40 p-6 pr-12 backdrop-blur-sm transition-colors hover:bg-elevated/70"
    :target="props.external ? '_blank' : undefined"
    :rel="props.external ? 'noopener' : undefined"
  >
    <span
      v-if="iconList.length"
      class="mb-2 flex gap-2.5 text-muted transition-colors group-hover:text-primary"
    >
      <UIcon
        v-for="icon in iconList"
        :key="icon"
        :name="icon"
        class="size-6"
      />
    </span>
    <span
      class="text-[1.05rem] font-medium text-highlighted"
      :class="{ 'font-mono': /^(use|<)/.test(props.name) }"
    >{{ props.name }}</span>
    <span class="max-w-[44ch] text-base/[1.7] text-muted"><slot mdc-unwrap="p" /></span>
    <UIcon
      name="i-ph-arrow-up-right"
      class="absolute top-6 right-6 size-4.5 -translate-x-1.5 translate-y-1.5 text-primary opacity-0 transition group-hover:translate-0 group-hover:opacity-100"
    />
  </NuxtLink>
</template>
