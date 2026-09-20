import { useEffect, useRef } from 'react'

const BG = '#08080b'
const GRAYS = [
  [104, 99, 108], // brightened #444047
  [122, 114, 121], // brightened #514A50
  [136, 116, 126], // brightened #5A4B52
]
const MAUVE = [210, 140, 160] // brightened #B4778A

const SPACING = 38 // px — grid pitch, both axes
const RADIUS_MIN = 1.2
const RADIUS_MAX = 1.9
const CURSOR_RADIUS = 240
const MAX_PUSH = 48
const MAX_PUSH_SCALE = 1.9
const EASE = 0.1
const SETTLE_EPSILON = 0.02

function pickColor() {
  if (Math.random() < 0.92) return GRAYS[(Math.random() * GRAYS.length) | 0]
  return MAUVE
}

/**
 * Full-viewport, fixed, canvas-based particle grid for the Get in Touch
 * page. Particles sit on a strict, evenly-spaced grid (no positional
 * jitter) and stay put until the cursor passes near them, then ease back
 * to their exact grid position. No continuous animation loop — rAF only
 * runs while particles are still settling.
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
      const cols = Math.ceil(window.innerWidth / SPACING) + 1
      const rows = Math.ceil(window.innerHeight / SPACING) + 1
      const list = []
      for (let cy = 0; cy < rows; cy++) {
        for (let cx = 0; cx < cols; cx++) {
          const [r, g, b] = pickColor()
          list.push({
            ox: cx * SPACING,
            oy: cy * SPACING,
            dx: 0,
            dy: 0,
            r: Math.random() * (RADIUS_MAX - RADIUS_MIN) + RADIUS_MIN,
            a: Math.random() * 0.2 + 0.22,
            color: `${r},${g},${b}`,
          })
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
      const push = MAX_PUSH * speedScale
      for (const p of particles) {
        let tx = 0
        let ty = 0
        if (nearCursor) {
          const ddx = p.ox - mouse.x
          const ddy = p.oy - mouse.y
          const dist = Math.hypot(ddx, ddy)
          if (dist < CURSOR_RADIUS && dist > 0.001) {
            // raised-cosine falloff: 1 at cursor, smoothly to 0 at the radius edge
            const falloff = 0.5 * (1 + Math.cos((Math.PI * dist) / CURSOR_RADIUS))
            const strength = falloff * push
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
