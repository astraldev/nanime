<script setup lang="ts">
import { reactive } from 'vue'

const PARTICLE_SPACING = 24
const PARTICLE_SIZE = 1.6
const CURSOR_RADIUS = 170
const PUSH_STRENGTH = 0.35
const SPRING = 0.045
const DAMPING = 0.84
const CURSOR_SMOOTHING_MS = 260
const MAX_ALPHA = 0.24
const MAX_OFFSET = 6

const canvas = useTemplateRef<HTMLCanvasElement>('canvas')
const cursor = reactive({ x: -9999, y: -9999 })
const cursorAnim = useAnimatable(cursor, { x: CURSOR_SMOOTHING_MS, y: CURSOR_SMOOTHING_MS })

onMounted(() => {
  const el = canvas.value
  const context = el?.getContext('2d')
  if (!el || !context) return
  const cv: HTMLCanvasElement = el
  const ctx: CanvasRenderingContext2D = context
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || matchMedia('(pointer: coarse)').matches) return

  let w = 0
  let h = 0
  let hx = new Float32Array(0)
  let hy = new Float32Array(0)
  let px = new Float32Array(0)
  let py = new Float32Array(0)
  let vx = new Float32Array(0)
  let vy = new Float32Array(0)
  let al = new Float32Array(0)
  let raf = 0
  let present = false
  let accent = ''

  function build() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    w = window.innerWidth
    h = window.innerHeight
    cv.width = Math.round(w * dpr)
    cv.height = Math.round(h * dpr)
    cv.style.width = `${w}px`
    cv.style.height = `${h}px`
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    const cols = Math.ceil(w / PARTICLE_SPACING) + 1
    const rows = Math.ceil(h / PARTICLE_SPACING) + 1
    const n = cols * rows
    hx = new Float32Array(n)
    hy = new Float32Array(n)
    px = new Float32Array(n)
    py = new Float32Array(n)
    vx = new Float32Array(n)
    vy = new Float32Array(n)
    al = new Float32Array(n)
    const ox = (w - (cols - 1) * PARTICLE_SPACING) / 2
    const oy = (h - (rows - 1) * PARTICLE_SPACING) / 2
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i = r * cols + c
        hx[i] = px[i] = ox + c * PARTICLE_SPACING
        hy[i] = py[i] = oy + r * PARTICLE_SPACING
      }
    }
  }

  function frame() {
    const rx = cursorAnim.x?.()
    const ry = cursorAnim.y?.()
    const cx = typeof rx === 'number' ? rx : -9999
    const cy = typeof ry === 'number' ? ry : -9999
    const r2 = CURSOR_RADIUS * CURSOR_RADIUS
    let busy = false

    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = accent

    for (let i = 0; i < px.length; i++) {
      let ax = (hx[i]! - px[i]!) * SPRING
      let ay = (hy[i]! - py[i]!) * SPRING
      const dx = px[i]! - cx
      const dy = py[i]! - cy
      const d2 = dx * dx + dy * dy
      let target = 0
      if (present && d2 < r2) {
        const d = Math.sqrt(d2)
        target = 1 - d / CURSOR_RADIUS
        if (d > 0.1) {
          const f = target * target * PUSH_STRENGTH
          ax += (dx / d) * f * 2
          ay += (dy / d) * f * 2
        }
      }
      vx[i] = (vx[i]! + ax) * DAMPING
      vy[i] = (vy[i]! + ay) * DAMPING
      const ox = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, px[i]! + vx[i]! - hx[i]!))
      const oy = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, py[i]! + vy[i]! - hy[i]!))
      px[i] = hx[i]! + ox
      py[i] = hy[i]! + oy

      const a = al[i]!
      const next = a + (target - a) * (target > a ? 0.25 : 0.08)
      al[i] = next
      if (next > 0.01) {
        busy = true
        const size = PARTICLE_SIZE + next
        ctx.globalAlpha = next * MAX_ALPHA
        ctx.fillRect(px[i]! - size / 2, py[i]! - size / 2, size, size)
      }
      else if (Math.abs(vx[i]!) + Math.abs(vy[i]!) > 0.02) busy = true
    }
    ctx.globalAlpha = 1

    if (busy || present) raf = requestAnimationFrame(frame)
    else {
      ctx.clearRect(0, 0, w, h)
      raf = 0
    }
  }

  function start() {
    if (raf) return
    accent = getComputedStyle(cv).color
    raf = requestAnimationFrame(frame)
  }

  function onMove(e: PointerEvent) {
    if (!present) {
      cursorAnim.x?.(e.clientX, 0)
      cursorAnim.y?.(e.clientY, 0)
      present = true
    }
    else {
      cursorAnim.x?.(e.clientX)
      cursorAnim.y?.(e.clientY)
    }
    start()
  }
  function onLeave() {
    present = false
  }
  function onVisibility() {
    if (document.hidden) {
      cancelAnimationFrame(raf)
      raf = 0
    }
    else if (present) start()
  }
  function onResize() {
    build()
  }

  build()
  window.addEventListener('resize', onResize)
  window.addEventListener('pointermove', onMove, { passive: true })
  document.documentElement.addEventListener('pointerleave', onLeave)
  document.addEventListener('visibilitychange', onVisibility)

  onBeforeUnmount(() => {
    cancelAnimationFrame(raf)
    window.removeEventListener('resize', onResize)
    window.removeEventListener('pointermove', onMove)
    document.documentElement.removeEventListener('pointerleave', onLeave)
    document.removeEventListener('visibilitychange', onVisibility)
  })
})
</script>

<template>
  <canvas
    ref="canvas"
    class="pointer-events-none fixed inset-0 z-0 text-primary"
    aria-hidden="true"
  />
</template>
