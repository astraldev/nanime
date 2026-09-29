<script setup lang="ts">
import type { DocsCollectionItem } from '@nuxt/content'

const props = defineProps<{
  page?: DocsCollectionItem | null
}>()

const links = computed(() => props.page?.body?.toc?.links || [])

const wideExample = computed(() => {
  const path = props.page?.path ?? ''
  return path.startsWith('/examples/') && path !== '/examples/introduction'
})

const sidebarItems = useSidebarNavigation()
const tocOnLeft = computed(() => sidebarItems.value.length <= 1)

const { subNavigationMode } = useSubNavigation()
const appConfig = useAppConfig()
const { t } = useDocusI18n()

const contentTocVariants = useUIConfig('contentToc')
</script>

<template>
  <div
    :data-wide-example="wideExample || undefined"
    :data-toc-left="tocOnLeft || undefined"
  >
    <UContentToc
      v-if="links.length && !wideExample"
      :highlight="contentTocVariants.highlight ?? true"
      :highlight-color="contentTocVariants.highlightColor"
      :highlight-variant="contentTocVariants.highlightVariant ?? 'circuit'"
      :color="contentTocVariants.color"
      :title="appConfig.toc?.title || t('docs.toc')"
      :links="links"
      :class="{ 'hidden lg:block': subNavigationMode }"
    >
      <template
        v-if="!tocOnLeft"
        #bottom
      >
        <DocsAsideRightBottom />
      </template>
    </UContentToc>

    <DocsAsideMobileBar :links="links" />
  </div>
</template>

<style>
@media (min-width: 1024px) {
  [data-slot="root"]:has(> [data-wide-example]) > [data-slot="center"] {
    grid-column: span 10 / span 10;
  }

  [data-slot="root"] > [data-wide-example] {
    display: none;
  }

  [data-slot="root"] > [data-toc-left] {
    order: -1;
  }

  [data-slot="root"]:has(> [data-toc-left]) > [data-slot="center"] {
    max-width: calc(80% - 0.5rem);
  }

  [data-toc-left] > nav {
    margin-inline-end: 0;
    padding-inline-end: 0;
    backdrop-filter: none;
  }
}
</style>
