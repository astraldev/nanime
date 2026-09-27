import { nextTick, onBeforeUnmount, onMounted, watch } from 'vue'
import { useColorMode } from '#imports'
import type { SceneColors } from './scene'

// The site's primary colour steps through the AnimeJS palette in a CSS animation, which fires no event per step.
const POLL_INTERVAL = 2000

// Hands the theme's colours to `apply` as 0xRRGGBB on colour mode changes and every POLL_INTERVAL.
// Returns the paint function for the first paint, once there is something to apply them to.
export function useSceneColors(apply: (colors: SceneColors) => void) {
  const colorMode = useColorMode()
  let probe: HTMLElement | null = null
  let context: CanvasRenderingContext2D | null = null
  let poll = 0

  // Resolves any CSS colour, whatever colour space the stylesheet wrote it in.
  function read(element: HTMLElement, pixel: CanvasRenderingContext2D, value: string) {
    element.style.color = value
    pixel.fillStyle = getComputedStyle(element).color
    pixel.fillRect(0, 0, 1, 1)
    const [red = 0, green = 0, blue = 0] = pixel.getImageData(0, 0, 1, 1).data
    return (red << 16) | (green << 8) | blue
  }

  function paint() {
    if (!probe || !context) return
    apply({
      body: read(probe, context, 'var(--ui-text-highlighted)'),
      accent: read(probe, context, 'var(--color-primary)'),
    })
  }

  onMounted(() => {
    probe = document.createElement('span')
    probe.hidden = true
    document.body.append(probe)
    context = document.createElement('canvas').getContext('2d', { willReadFrequently: true })
    poll = window.setInterval(paint, POLL_INTERVAL)
  })

  watch(() => colorMode.value, () => nextTick(paint))

  onBeforeUnmount(() => {
    window.clearInterval(poll)
    probe?.remove()
    probe = null
  })

  return paint
}
