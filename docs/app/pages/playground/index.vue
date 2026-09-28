<script setup lang="ts">
useSeoMeta({ title: 'Playground', robots: 'noindex, nofollow' })

const router = useRouter()

const pages = computed(() => router.getRoutes()
  .map(route => route.path)
  .filter(path => path.startsWith('/playground/') && !path.includes(':'))
  .sort())
</script>

<template>
  <UContainer class="py-10 space-y-6">
    <h1 class="text-2xl font-semibold">
      Playground
    </h1>
    <ul class="space-y-2">
      <li
        v-for="path in pages"
        :key="path"
      >
        <a
          :href="path"
          target="_blank"
          rel="noopener"
          class="text-primary hover:underline font-mono"
        >
          {{ path }}
        </a>
      </li>
    </ul>
  </UContainer>
</template>
