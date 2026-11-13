<script setup lang="ts">
const props = defineProps<{
  name: string
  to: string
  icons?: string
  external?: boolean
}>()

const iconList = computed(() => props.icons?.split(/\s+/).filter(Boolean) ?? [])

function onPointerMove(event: PointerEvent) {
  const el = event.currentTarget
  if (!(el instanceof HTMLElement)) return
  const rect = el.getBoundingClientRect()
  el.style.setProperty('--spot-x', `${event.clientX - rect.left}px`)
  el.style.setProperty('--spot-y', `${event.clientY - rect.top}px`)
}
</script>

<template>
  <NuxtLink
    :to="props.to"
    class="group relative isolate flex flex-col gap-3 rounded-md bg-elevated/40 p-6 pr-12 backdrop-blur-sm transition-colors hover:bg-elevated/70"
    :target="props.external ? '_blank' : undefined"
    :rel="props.external ? 'noopener' : undefined"
    @pointermove="onPointerMove"
  >
    <span
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 -z-10 rounded-md text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      style="background: radial-gradient(320px circle at var(--spot-x, 50%) var(--spot-y, 50%), color-mix(in oklab, currentColor 16%, transparent), transparent 70%)"
    />
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
