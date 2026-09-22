<script setup lang="ts">
import { computed } from 'vue'
import { CHANGELOG_TYPES, type ChangelogType } from '~/utils/changelog'

const props = defineProps<{
  type: ChangelogType
}>()

const meta = computed(() => CHANGELOG_TYPES[props.type])
</script>

<template>
  <UTooltip
    :text="`${meta.label}: ${meta.description}`"
    :content="{ side: 'right' }"
    :ui="{ content: 'text-sm', text: 'text-sm' }"
  >
    <button
      type="button"
      class="changelog-tag inline-block shrink-0"
      :data-type="type"
      :style="{
        width: '3px',
        height: '1lh',
        marginLeft: '-9px',
        marginRight: '6px',
        borderRadius: '1px',
        verticalAlign: 'middle',
        backgroundColor: meta.color,
      }"
      :aria-label="`${meta.label}: ${meta.description}`"
    />
  </UTooltip>
</template>

<style scoped>
.changelog-tag {
  transform-origin: center;
  transition: transform 0.15s ease;
}

.changelog-tag:hover,
.changelog-tag:focus-visible {
  transform: scaleX(1.25);
}
</style>
