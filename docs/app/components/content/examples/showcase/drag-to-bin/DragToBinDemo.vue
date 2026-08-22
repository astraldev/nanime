<script setup lang="ts">
import ExampleWrapper from '~/components/shared/ExampleWrapper.vue'
import DragBinCard from './DragBinCard.vue'

const cards = ['Design system', 'Nuxt SSR', 'Anime.js v4', 'Tailwind CSS'].map(label => ({
  label,
  binned: ref(false),
  over: ref(false),
}))

const bin = useTemplateRef('bin')

const remaining = computed(() => cards.filter(card => !card.binned.value).length)
const armed = computed(() => cards.some(card => !card.binned.value && card.over.value))

const actions = [{
  label: 'Restore',
  run: () => cards.forEach((card) => { card.binned.value = false }),
}]
</script>

<template>
  <ExampleWrapper
    :actions="actions"
    :status="`${remaining} left`"
  >
    <div class="flex gap-4">
      <div class="flex-1 flex flex-col">
        <div
          v-for="card in cards"
          :key="card.label"
          class="ghost"
          :class="{ 'is-binned': card.binned.value }"
        >
          <DragBinCard
            :label="card.label"
            :binned="card.binned.value"
            :bin="bin"
            @bin="card.binned.value = true"
            @over="card.over.value = $event"
          />
        </div>
      </div>

      <div
        ref="bin"
        class="bin"
        :class="{ 'is-armed': armed }"
      >
        <UIcon
          name="i-ph-trash"
          class="size-6"
        />
        <span class="text-xs">Drop here</span>
      </div>
    </div>
  </ExampleWrapper>
</template>

<style scoped>
@reference "~/assets/css/main.css";

.ghost {
  height: 3rem;
  margin-bottom: 0.5rem;
  position: relative;
  transition: all var(--motion-standard) var(--motion-ease);
}

/* Marks the slot the card came from once it is dragged away. */
.ghost::before {
  @apply absolute inset-y-0 left-0 right-1/2 rounded-lg border border-dashed border-primary/20;
  content: '';
}

.ghost.is-binned {
  height: 0;
  margin-bottom: 0;
  pointer-events: none;
}

.bin {
  @apply w-40 rounded-lg border border-dashed border-primary/35 grid place-items-center gap-1 text-primary/70;
  transition: all var(--motion-quick) var(--motion-ease);
}

.bin.is-armed {
  @apply border-solid border-primary bg-primary/10 text-primary;
}

@media (prefers-reduced-motion: reduce) {
  .ghost,
  .bin {
    transition: none;
  }
}
</style>
