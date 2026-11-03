<script setup lang="ts">
import { changelogLatestKey } from '~/utils/changelog'

const props = defineProps<{
  date?: string
}>()

const latestState = inject(changelogLatestKey, undefined)
const latest = Boolean(props.date && latestState && !latestState.claimed)
if (latest && latestState) latestState.claimed = true

const label = computed(() => props.date
  ? new Date(`${props.date}T00:00:00Z`).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' })
  : 'Unreleased')
</script>

<template>
  <span class="flex items-center gap-2">
    <time
      :datetime="props.date"
      class="text-sm text-muted"
    >{{ label }}</time>
    <UBadge
      v-if="latest"
      label="Latest"
      color="primary"
      variant="subtle"
      size="sm"
    />
  </span>
</template>
