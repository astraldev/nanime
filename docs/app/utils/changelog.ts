export type ChangelogType = 'added' | 'fixed' | 'breaking' | 'performance' | 'packaging' | 'docs'

interface ChangelogTypeMeta {
  label: string
  description: string
  color: string
}

export const CHANGELOG_TYPES: Record<ChangelogType, ChangelogTypeMeta> = {
  added: { label: 'New features', description: 'A new feature or capability.', color: 'var(--hex-green-1)' },
  fixed: { label: 'Bug fixes', description: 'A bug fix.', color: 'var(--hex-yellow-1)' },
  breaking: { label: 'Breaking changes', description: 'Needs a change to your code.', color: 'var(--hex-red-1)' },
  performance: { label: 'Performance & optimizations', description: 'A speed or efficiency improvement.', color: 'var(--hex-sega-1)' },
  packaging: { label: 'Packaging', description: 'A dependency or install change.', color: 'var(--hex-gray-1)' },
  docs: { label: 'Documentation', description: 'A documentation change.', color: 'var(--hex-purple-1)' },
}
