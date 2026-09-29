<script setup lang="ts">
import type { NanimeComponentDefaults } from '#nanime/types'

const props = defineProps<{ defaults: NanimeComponentDefaults }>()

provideAnimeDefaults(() => props.defaults)
</script>

<template>
  <slot />
</template>
