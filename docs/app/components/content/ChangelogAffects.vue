<script setup lang="ts">
import { computed } from 'vue'
import { apiPage } from '~/utils/changelog'

const props = defineProps<{
  of: string
}>()

const names = computed(() => props.of.split(/\s+/).filter(Boolean))
</script>

<template>
  <span class="changelog-affects">
    <NuxtLink
      v-for="name in names"
      :key="name"
      :to="apiPage(name)"
    >{{ name }}</NuxtLink>
  </span>
</template>

<style scoped>
.changelog-affects {
  display: block;
  margin-top: 0.125rem;
  font-family: var(--font-mono);
  font-size: 0.8125em;
  color: var(--ui-text-muted);
}

.changelog-affects a {
  color: inherit;
  text-decoration: none;
}

.changelog-affects a + a {
  margin-left: 0.625rem;
}

.changelog-affects a:hover {
  color: var(--ui-text-highlighted);
}
</style>
