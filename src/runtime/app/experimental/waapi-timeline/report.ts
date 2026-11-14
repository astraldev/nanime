export function fail(error: Error): void {
  if (process.env.NODE_ENV !== 'production') throw error
  console.error(error.message)
}

export function warnEmptyAutoplay(name: string): void {
  console.warn(`${name}: autoplay is on, and you may have started a timeline without defining any tweens.`)
}
