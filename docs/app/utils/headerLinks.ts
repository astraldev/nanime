export const headerLinks = [
  { label: 'Guide', sections: ['/getting-started', '/guides'], to: '/getting-started/introduction' },
  { label: 'API', sections: ['/composables', '/components'], to: '/composables/introduction' },
  { label: 'Updates', sections: ['/changes'], to: '/changes/changelog' },
]

export const inSection = (path: string, sections: string[]) => sections.some(section => path === section || path.startsWith(`${section}/`))
