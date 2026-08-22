<script setup lang="ts">
export type ExampleAction = {
  label: string
  run: () => void
  active?: boolean
}

export type ExampleSlider = {
  value: number
  min?: number
  max?: number
  step?: number
  onInput: (value: number) => void
}

defineProps<{
  actions?: ExampleAction[]
  slider?: ExampleSlider
  status?: string
}>()

function onSliderInput(event: Event, slider: ExampleSlider) {
  if (!(event.target instanceof HTMLInputElement)) return
  slider.onInput(Number.parseFloat(event.target.value))
}
</script>

<template>
  <div class="example-wrapper p-4 rounded-lg flex flex-col gap-4 border border-primary/20 bg-primary/5">
    <slot />

    <div
      v-if="actions?.length || slider || status"
      class="flex flex-wrap gap-3 items-center justify-between text-xs"
    >
      <div
        v-if="actions?.length"
        class="flex gap-2"
      >
        <button
          v-for="action in actions"
          :key="action.label"
          class="demo-button"
          :class="{ 'demo-button-active': action.active }"
          @click="action.run"
        >
          {{ action.label }}
        </button>
      </div>

      <span
        v-if="status"
        class="font-mono text-primary/70"
      >
        {{ status }}
      </span>

      <input
        v-if="slider"
        type="range"
        :min="slider.min ?? 0"
        :max="slider.max ?? 1"
        :step="slider.step ?? 0.001"
        :value="slider.value"
        class="basis-full accent-primary cursor-pointer h-1.5 bg-primary/20 rounded-lg appearance-none"
        @input="onSliderInput($event, slider)"
      >
    </div>
  </div>
</template>

<style>
@reference "~/assets/css/main.css";

.simple-box {
  @apply rounded-md h-8 bg-primary grid place-items-center font-semibold backdrop-blur-md;
}

.demo-button {
  @apply px-2.5 py-1 rounded border font-semibold cursor-pointer;
  @apply bg-primary/5 text-primary border-primary/20 hover:bg-primary/10;
  transition: background-color var(--motion-quick) var(--motion-ease);
}

.demo-button-active {
  @apply bg-primary text-black border-primary hover:bg-primary;
}

.spot {
  @apply py-1 w-12 px-1.5 z-10 grid place-items-center;
  @apply border border-dashed border-primary/35 rounded font-bold font-mono;

  background-image: repeating-linear-gradient(
    45deg,
    color-mix(in hsl, var(--color-primary), transparent 80%) 0,
    color-mix(in hsl, var(--color-primary), transparent 80%) 1px,
    transparent 1px,
    transparent 6px
  );
}
</style>
