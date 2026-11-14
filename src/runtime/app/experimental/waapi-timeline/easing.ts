const CSS_EASE = /^(?:linear|ease|ease-in|ease-out|ease-in-out|cubic-bezier|steps|step-start|step-end)\b/

export interface ResolvedEase {
  easing: string
}

const warnedEases = new Set<string>()

function warnUnknown(ease: string): void {
  if (warnedEases.has(ease)) return
  warnedEases.add(ease)
  console.warn(`createWaapiTimeline: unknown ease "${ease}", using linear. Pass a CSS easing string; convert AnimeJS eases with waapi.convertEase().`)
}

/**
 * Validates a CSS easing string. Anything else warns and falls back to linear.
 */
export function resolveEase(ease: string): ResolvedEase {
  if (typeof ease === 'string' && CSS_EASE.test(ease)) return { easing: ease }

  warnUnknown(String(ease))
  return { easing: 'linear' }
}
