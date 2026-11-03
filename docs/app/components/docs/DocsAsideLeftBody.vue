<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'

interface NavGroup {
  label: string
  paths: string[]
}

interface NavLink {
  path: string
  title: string
  icon?: string
  mono: boolean
}

const groups: NavGroup[] = [
  { label: 'Get Started', paths: ['/getting-started/introduction', '/getting-started/installation'] },
  { label: 'Animate', paths: ['/composables/introduction', '/composables/use-animate', '/composables/use-waapi-animate', '/composables/use-animatable', '/composables/use-anime-timeline'] },
  { label: 'Text', paths: ['/composables/use-split-text', '/composables/use-scramble-text'] },
  { label: 'Interaction', paths: ['/composables/use-draggable', '/composables/use-anime-scroll'] },
  { label: 'Transitions', paths: ['/components/transitions', '/components/transition-group', '/components/transition-styles'] },
  { label: 'Layout', paths: ['/components/layout-group', '/composables/use-anime-layout'] },
  { label: 'Guides', paths: ['/guides/configuration', '/guides/presets', '/guides/performance', '/guides/accessibility', '/guides/vue'] },
  { label: 'Reference', paths: ['/composables/utilities', '/comparisons/vs-nuxt-modules', '/comparisons/vs-vue-packages', '/examples/introduction', '/changes/changelog'] },
]

const labelOverrides: Record<string, string> = {
  '/composables/introduction': 'Overview',
}

const route = useRoute()
const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')

const byPath = computed(() => {
  const map = new Map<string, ContentNavigationItem>()
  const walk = (items: ContentNavigationItem[]) => {
    for (const item of items) {
      map.set(item.path, item)
      if (item.children) walk(item.children)
    }
  }
  walk(navigation?.value ?? [])
  return map
})

const query = ref('')

function toLink(path: string): NavLink[] {
  const item = byPath.value.get(path)
  if (!item) return []
  const title = labelOverrides[path] ?? item.title
  const icon = typeof item.icon === 'string' ? item.icon : undefined
  return [{ path, title, icon, mono: /^use[A-Z]/.test(title) }]
}

const resolved = computed(() => {
  const mapped = new Set(groups.flatMap(group => group.paths))
  const unmapped = [...byPath.value.values()]
    .filter(item => !item.children?.length && !mapped.has(item.path))
    .map(item => item.path)
  const all = unmapped.length ? [...groups, { label: 'More', paths: unmapped }] : groups
  return all.map(group => ({ label: group.label, links: group.paths.flatMap(toLink) }))
})

const filtering = computed(() => query.value.trim().length > 0)

const visible = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return resolved.value
  return resolved.value
    .map(group => group.label.toLowerCase().includes(q)
      ? group
      : { ...group, links: group.links.filter(link => link.title.toLowerCase().includes(q)) })
    .filter(group => group.links.length > 0)
})

const open = ref<string[]>([])

function openCurrent() {
  const current = resolved.value.find(group => group.links.some(link => link.path === route.path))
  if (current && !open.value.includes(current.label)) open.value = [...open.value, current.label]
}

openCurrent()
watch(() => route.path, openCurrent)

function toggle(label: string) {
  open.value = open.value.includes(label)
    ? open.value.filter(item => item !== label)
    : [...open.value, label]
}

const isOpen = (label: string) => filtering.value || open.value.includes(label)
</script>

<template>
  <nav
    aria-label="Documentation"
    class="flex flex-col gap-4 pb-6"
  >
    <UInput
      v-model="query"
      type="search"
      placeholder="Filter…"
      icon="i-lucide-search"
      size="sm"
      variant="outline"
      aria-label="Filter documentation"
      @keydown.esc="query = ''"
    />

    <p
      v-if="filtering && !visible.length"
      class="px-2 text-sm text-muted"
    >
      Nothing matches.
    </p>

    <ul class="flex flex-col gap-1">
      <li
        v-for="group in visible"
        :key="group.label"
      >
        <button
          type="button"
          class="group flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-[13px] font-semibold text-muted transition-colors hover:text-highlighted focus-visible:outline-2 focus-visible:outline-primary"
          :aria-expanded="isOpen(group.label)"
          :disabled="filtering"
          @click="toggle(group.label)"
        >
          <span>{{ group.label }}</span>
          <UIcon
            name="i-lucide-chevron-right"
            class="size-3.5 shrink-0 transition-transform"
            :class="{ 'rotate-90': isOpen(group.label) }"
          />
        </button>

        <ul
          v-show="isOpen(group.label)"
          class="mt-1 mb-2 flex flex-col gap-0.5 border-s border-default ms-2.5"
        >
          <li
            v-for="link in group.links"
            :key="link.path"
          >
            <NuxtLink
              :to="link.path"
              class="-ms-px flex items-center gap-2 border-s py-1.5 ps-3 pe-2 text-sm transition-colors"
              :class="[
                route.path === link.path
                  ? 'border-primary text-primary font-medium'
                  : 'border-transparent text-muted hover:text-highlighted hover:border-accented',
                link.mono ? 'font-mono text-[13px]' : '',
              ]"
              :aria-current="route.path === link.path ? 'page' : undefined"
            >
              <UIcon
                v-if="link.icon"
                :name="link.icon"
                class="size-4 shrink-0"
              />
              <span class="truncate">{{ link.title }}</span>
            </NuxtLink>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
</template>
