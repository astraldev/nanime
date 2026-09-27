import type { ContentNavigationItem } from '@nuxt/content'

// Inside a header section the sidebar lists only its pages; elsewhere it hides those sections.
export function useSidebarNavigation() {
  const route = useRoute()
  const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')

  return computed(() => {
    const nav = navigation?.value ?? []
    const current = headerLinks.find(link => inSection(route.path, link.section))
    if (current) return nav.find(item => item.path === current.section)?.children ?? []
    return nav.filter(item => !headerLinks.some(link => link.section === item.path))
  })
}
