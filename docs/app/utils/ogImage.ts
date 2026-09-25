export function formatOgDescription(_title: string | undefined, description: string | undefined): string | undefined {
  return description?.replace(/\.+$/, '')
}
