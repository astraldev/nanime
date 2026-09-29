// Sections linked from the header instead of the sidebar.
export const headerLinks = [
  { label: 'Examples', section: '/examples', to: '/examples/introduction' },
  { label: 'Changelog', section: '/changes', to: '/changes/changelog' },
]

export const inSection = (path: string, section: string) => path === section || path.startsWith(`${section}/`)
