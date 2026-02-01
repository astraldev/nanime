<template>
  <NuxtLink
    :to="to"
    class="group p-6 bg-gray-800/50 hover:bg-gray-700/50 rounded-xl transition-colors border border-gray-700 hover:border-gray-600"
  >
    <h3 class="text-xl font-semibold text-white mb-2 group-hover:text-green-400 transition-colors">
      {{ title }}
    </h3>
    <p class="text-gray-400 text-sm">
      {{ description }}
    </p>
  </NuxtLink>
</template>

<script setup lang="ts">
interface Props {
  to: string
  title: string
  description: string
}

defineProps<Props>()
</script>
