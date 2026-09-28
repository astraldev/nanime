<script setup lang="ts">
defineProps<{
  title: string
}>()

const emit = defineEmits<{
  reset: []
}>()

const highlight = ref(true)
</script>

<template>
  <div
    class="scene-window not-prose overflow-hidden rounded-xl border border-default bg-default text-default shadow-sm"
    :class="{ 'show-live': highlight }"
  >
    <div class="flex items-center gap-3 border-b border-default bg-elevated/50 px-4 py-2.5 text-sm whitespace-nowrap">
      <div class="hidden gap-2 sm:flex">
        <span
          v-for="dot in 3"
          :key="dot"
          class="size-3 rounded-full bg-accented"
        />
      </div>
      <span class="truncate font-medium text-muted">{{ title }}</span>
      <div class="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
        <label class="flex cursor-pointer items-center gap-2 text-muted">
          <USwitch
            v-model="highlight"
            size="sm"
          />
          <span>Show interactive</span>
        </label>
        <button
          type="button"
          aria-label="Reset"
          class="flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 text-muted hover:bg-elevated hover:text-default"
          @click="emit('reset')"
        >
          <UIcon
            name="i-ph-arrow-counter-clockwise"
            class="size-4"
          />
          <span class="hidden sm:inline">Reset</span>
        </button>
      </div>
    </div>

    <slot />
  </div>
</template>

<style>
.scene-window [data-live] {
  position: relative;
}

.scene-window.show-live [data-live] {
  outline: 1.5px dashed color-mix(in oklab, var(--color-primary), transparent 30%);
  outline-offset: 3px;
}

.scene-window.show-live [data-live]::after {
  content: attr(data-live);
  position: absolute;
  top: -0.625rem;
  left: -0.625rem;
  z-index: 30;
  display: grid;
  place-items: center;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 9999px;
  background: var(--color-primary);
  color: white;
  font-size: 11px;
  font-weight: 700;
  animation: scene-live-pulse 2s ease-in-out infinite;
  pointer-events: none;
}

@keyframes scene-live-pulse {
  0%, 100% { box-shadow: 0 0 0 0 color-mix(in oklab, var(--color-primary), transparent 40%); }
  50% { box-shadow: 0 0 0 5px color-mix(in oklab, var(--color-primary), transparent 100%); }
}
</style>
