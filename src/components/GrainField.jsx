import { useEffect, useRef } from 'react'

const BG = '#08080b'
const GRAY = [150, 148, 153]
const PINK_MUTED = [205, 150, 163]
const PINK_BRIGHT = [233, 143, 165] // #E98FA5
const GLOW_PINK = '233, 143, 165'

const CELL = 18 // px — jittered-grid cell size for organic, gap-free density
const CURSOR_RADIUS = 150
const BASE_PUSH = 14
const MAX_PUSH_SCALE = 2.2
const EASE = 0.09
const SETTLE_EPSILON = 0.02

function pickColor() {
  const roll = Math.random()
  if (roll < 0.4) return GRAY
  if (roll < 0.85) return PINK_MUTED
  return PINK_BRIGHT
}

/**
 * Full-viewport, fixed, canvas-based grain field for the Get in Touch page.
 * A single dense particle set (jittered grid, not a sparse random scatter)
 * gives a clearly-visible static texture; particles only move when the
 * cursor passes within range, easing back once it moves on. No continuous
 * animation loop — rAF only runs while particles are still settling.
 */
export default function GrainField() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    let width = 0
    let height = 0
    let particles = []
    let mouse = { x: -9999, y: -9999, t: 0 }
    let speedScale = 1
    let raf = null

    const makeParticles = () => {
      const cols = Math.ceil(window.innerWidth / CELL)
      const rows = Math.ceil(window.innerHeight / CELL)
      const list = []
      for (let cy = 0; cy < rows; cy++) {
        for (let cx = 0; cx < cols; cx++) {
          const roll = Math.random()
          if (roll < 0.06) continue // small gaps for organic density variation
          const extra = roll > 0.94 ? 1 : 0 // occasional denser clump
          for (let n = 0; n <= extra; n++) {
            const [r, g, b] = pickColor()
            // most grains ~2px, some ~3px, a few ~4px (visual diameter)
            const sizeRoll = Math.random()
            const radius = sizeRoll < 0.55 ? Math.random() * 0.3 + 0.9
              : sizeRoll < 0.88 ? Math.random() * 0.35 + 1.3
              : Math.random() * 0.4 + 1.7
            list.push({
              ox: cx * CELL + Math.random() * CELL,
              oy: cy * CELL + Math.random() * CELL,
              dx: 0,
              dy: 0,
              r: radius,
              a: Math.random() * 0.3 + 0.15,
              color: `${r},${g},${b}`,
            })
          }
        }
      }
      particles = list
    }

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      makeParticles()
      draw()
    }

    const draw = () => {
      ctx.fillStyle = BG
      ctx.fillRect(0, 0, width, height)

      const g1 = ctx.createRadialGradient(
        width * 0.22, height * 0.28, 0,
        width * 0.22, height * 0.28, Math.max(width, height) * 0.55
      )
      g1.addColorStop(0, `rgba(${GLOW_PINK}, 0.08)`)
      g1.addColorStop(1, `rgba(${GLOW_PINK}, 0)`)
      ctx.fillStyle = g1
      ctx.fillRect(0, 0, width, height)

      const g2 = ctx.createRadialGradient(
        width * 0.78, height * 0.75, 0,
        width * 0.78, height * 0.75, Math.max(width, height) * 0.5
      )
      g2.addColorStop(0, `rgba(${GLOW_PINK}, 0.06)`)
      g2.addColorStop(1, `rgba(${GLOW_PINK}, 0)`)
      ctx.fillStyle = g2
      ctx.fillRect(0, 0, width, height)

      for (const p of particles) {
        ctx.beginPath()
        ctx.fillStyle = `rgba(${p.color},${p.a})`
        ctx.arc(p.ox + p.dx, p.oy + p.dy, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const tick = () => {
      let energy = 0
      const nearCursor = mouse.x > -1000
      const push = BASE_PUSH * speedScale
      for (const p of particles) {
        let tx = 0
        let ty = 0
        if (nearCursor) {
          const ddx = p.ox - mouse.x
          const ddy = p.oy - mouse.y
          const dist = Math.hypot(ddx, ddy)
          if (dist < CURSOR_RADIUS && dist > 0.001) {
            const strength = (1 - dist / CURSOR_RADIUS) * push
            tx = (ddx / dist) * strength
            ty = (ddy / dist) * strength
          }
        }
        p.dx += (tx - p.dx) * EASE
        p.dy += (ty - p.dy) * EASE
        energy += Math.abs(tx - p.dx) + Math.abs(ty - p.dy) + Math.abs(p.dx) + Math.abs(p.dy)
      }
      speedScale += (1 - speedScale) * 0.12
      draw()
      if (energy > SETTLE_EPSILON * particles.length) {
        raf = requestAnimationFrame(tick)
      } else {
        raf = null
      }
    }

    const wake = () => {
      if (!raf) raf = requestAnimationFrame(tick)
    }

    resize()

    let resizeTimer = null
    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(resize, 150)
    }
    window.addEventListener('resize', onResize)

    if (reduceMotion) {
      return () => {
        window.removeEventListener('resize', onResize)
        clearTimeout(resizeTimer)
      }
    }

    const onPointerMove = e => {
      const now = performance.now()
      const dt = Math.max(1, now - mouse.t)
      const dist = Math.hypot(e.clientX - mouse.x, e.clientY - mouse.y)
      const speed = mouse.x > -1000 ? Math.min(dist / dt, 6) : 0 // px/ms, clamped
      const targetScale = 1 + (speed / 6) * (MAX_PUSH_SCALE - 1)
      speedScale = Math.max(speedScale, targetScale)
      mouse.x = e.clientX
      mouse.y = e.clientY
      mouse.t = now
      wake()
    }
    const onPointerLeave = () => {
      mouse.x = -9999
      mouse.y = -9999
      wake()
    }
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerleave', onPointerLeave)

    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerleave', onPointerLeave)
      clearTimeout(resizeTimer)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return <canvas ref={canvasRef} className="grain-field" aria-hidden="true" />
}
