import type { ContentNavigationItem } from '@nuxt/content'

const standaloneSections = ['/changes']

export function useSidebarNavigation() {
  const route = useRoute()
  const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')

  return computed(() => {
    const nav = navigation?.value ?? []
    const section = standaloneSections.find(path => inSection(route.path, [path]))
    if (section) return nav.find(item => item.path === section)?.children ?? []
    return nav
  })
}
