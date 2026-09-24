/**
 * Compares two parameter objects structurally.
 *
 * - Keys matched by the optional `skip` predicate or array are excluded from comparison.
 * - Arrays and plain objects are compared recursively.
 * - Everything else (primitives, functions, DOM nodes, class instances such as
 *   Anime.js instances) uses `Object.is`.
 */
export function deepEqualWithSkip(
  prev: object,
  next: object,
  skip?: ((key: string, value: unknown) => boolean) | string[],
): boolean {
  if (prev === next) return true

  const prevEntries: [string, unknown][] = Object.entries(prev)
  const nextEntries = new Map<string, unknown>(Object.entries(next))

  const shouldSkip = (key: string, val: unknown): boolean => {
    if (!skip) return false
    if (typeof skip === 'function') return skip(key, val)
    return skip.includes(key)
  }

  const filteredPrev = prevEntries.filter(([key, value]) => !shouldSkip(key, value))
  const filteredNextCount = [...nextEntries].filter(([key, value]) => !shouldSkip(key, value)).length

  if (filteredPrev.length !== filteredNextCount) return false

  return filteredPrev.every(([key, value]) => nextEntries.has(key) && deepValueEqual(value, nextEntries.get(key)))
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null) return false
  const proto = Object.getPrototypeOf(value)
  return proto === Object.prototype || proto === null
}

function deepValueEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true

  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false
    return a.every((v, i) => deepValueEqual(v, b[i]))
  }

  if (!isPlainObject(a) || !isPlainObject(b)) return false

  const keys = Object.keys(a)
  if (keys.length !== Object.keys(b).length) return false

  return keys.every(key => key in b && deepValueEqual(a[key], b[key]))
}
