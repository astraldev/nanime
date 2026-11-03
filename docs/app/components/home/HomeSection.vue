<script setup lang="ts">
const props = defineProps<{
  label?: string
  title?: string
  why?: string
  to?: string
  linkLabel?: string
}>()
</script>

<template>
  <section class="relative z-1 border-t border-default py-[clamp(96px,10vw,128px)]">
    <div class="mx-auto max-w-6xl px-6">
      <header
        v-if="props.label || props.title || props.why"
        class="mb-14 max-w-176"
      >
        <p
          v-if="props.label"
          class="text-[0.95rem] font-medium text-primary"
        >
          {{ props.label }}
        </p>
        <h2
          v-if="props.title"
          class="mt-3 text-[clamp(1.8rem,3.6vw,2.6rem)] leading-[1.15] font-[650] tracking-[-0.02em] text-highlighted"
        >
          {{ props.title }}
        </h2>
        <p
          v-if="props.why"
          class="mt-5 max-w-[62ch] text-lg/[1.7] text-muted"
        >
          {{ props.why }}
        </p>
      </header>
      <slot />
      <NuxtLink
        v-if="props.to && props.linkLabel"
        :to="props.to"
        class="mt-12 inline-flex items-center gap-2 font-semibold text-highlighted transition-colors hover:text-primary"
      >
        <span>{{ props.linkLabel }}</span>
        <UIcon name="i-ph-arrow-right" />
      </NuxtLink>
    </div>
  </section>
</template>
