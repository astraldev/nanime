export function shallowEqual(a: Record<string, unknown>, b: Record<string, unknown>): boolean {
  if (a === b) return true

  const keys = Object.keys(a)
  if (keys.length !== Object.keys(b).length) return false

  return keys.every(key => Object.is(a[key], b[key]))
}
