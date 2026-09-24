/**
 * Compares two parameter objects structurally.
 *
 * - Keys matched by the optional `skip` predicate or array are excluded from comparison.
 * - Arrays and plain objects are compared recursively.
 * - Everything else (primitives, functions) uses `Object.is`.
 */
export function deepEqualWithSkip(
  prev: Record<string, unknown>,
  next: Record<string, unknown>,
  skip?: ((key: string, value: unknown) => boolean) | string[],
): boolean {
  if (prev === next) return true

  const rawPrevKeys = Object.keys(prev)
  const rawNextKeys = Object.keys(next)

  const shouldSkip = (key: string, val: unknown): boolean => {
    if (!skip) return false
    if (typeof skip === 'function') return skip(key, val)
    return skip.includes(key)
  }

  const filteredPrev = rawPrevKeys.filter(key => !shouldSkip(key, prev[key]))
  const filteredNext = rawNextKeys.filter(key => !shouldSkip(key, next[key]))

  if (filteredPrev.length !== filteredNext.length) return false

  return filteredPrev.every(key => key in next && deepValueEqual(prev[key], next[key]))
}

function deepValueEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true
  if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') return false

  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) return false
    return a.every((v, i) => deepValueEqual(v, b[i]))
  }

  if (Array.isArray(b)) return false

  const aObj = a as Record<string, unknown>
  const bObj = b as Record<string, unknown>
  const keys = Object.keys(aObj)
  if (keys.length !== Object.keys(bObj).length) return false

  return keys.every(key => deepValueEqual(aObj[key], bObj[key]))
}
