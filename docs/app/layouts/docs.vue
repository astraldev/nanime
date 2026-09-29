<script setup lang="ts">
const items = useSidebarNavigation()
</script>

<template>
  <UMain>
    <UContainer>
      <UPage>
        <template
          v-if="items.length > 1"
          #left
        >
          <UPageAside>
            <DocsAsideLeftTop />
            <DocsAsideLeftBody />
          </UPageAside>
        </template>
        <slot />
      </UPage>
    </UContainer>
  </UMain>
</template>
