<script setup lang="ts">
defineProps<{
  open: boolean
}>()
</script>

<template>
  <UButton
    size="sm"
    variant="ghost"
    color="neutral"
    class="-me-1.5"
    square
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="size-5"
      :class="{ open }"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <line
        x1="4"
        y1="6"
        x2="20"
        y2="6"
        class="top"
      />
      <line
        x1="4"
        y1="12"
        x2="20"
        y2="12"
        class="middle"
      />
      <line
        x1="4"
        y1="18"
        x2="20"
        y2="18"
        class="bottom"
      />
    </svg>
  </UButton>
</template>

<style scoped>
line {
  transform-box: fill-box;
  transform-origin: center;
  transition: transform 450ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 200ms ease;
}

.open .top {
  transform: translateY(6px) rotate(45deg);
}

.open .middle {
  opacity: 0;
}

.open .bottom {
  transform: translateY(-6px) rotate(-45deg);
}

@media (prefers-reduced-motion: reduce) {
  line {
    transition: none;
  }
}
</style>
