import { useEffect, useRef } from 'react'

const BG = '#0b0a0d'
const PINK = [246, 160, 181]
const GRAY = [186, 186, 190]
const DENSITY = 9000 // px^2 per particle — sparse, fine grain
const CURSOR_RADIUS = 70
const MAX_PUSH = 7
const EASE = 0.12
const SETTLE_EPSILON = 0.03

/**
 * Full-viewport, fixed, canvas-based dust field: sparse monochrome/pink
 * grain that stays static until the cursor passes near it, then eases
 * back to rest. No continuous animation loop — it only runs rAF while
 * particles are still moving, and stops the moment everything settles.
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
    let mouse = { x: -9999, y: -9999 }
    let raf = null

    const makeParticles = () => {
      const area = window.innerWidth * window.innerHeight
      const count = Math.round(area / DENSITY)
      particles = new Array(count).fill(0).map(() => {
        const isPink = Math.random() < 0.78
        const [r, g, b] = isPink ? PINK : GRAY
        return {
          ox: Math.random() * window.innerWidth,
          oy: Math.random() * window.innerHeight,
          dx: 0,
          dy: 0,
          r: Math.random() * 0.6 + 0.3,
          a: isPink ? Math.random() * 0.05 + 0.02 : Math.random() * 0.03 + 0.012,
          color: `${r},${g},${b}`,
        }
      })
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
      for (const p of particles) {
        let tx = 0
        let ty = 0
        if (nearCursor) {
          const ddx = p.ox - mouse.x
          const ddy = p.oy - mouse.y
          const dist = Math.hypot(ddx, ddy)
          if (dist < CURSOR_RADIUS && dist > 0.001) {
            const strength = (1 - dist / CURSOR_RADIUS) * MAX_PUSH
            tx = (ddx / dist) * strength
            ty = (ddy / dist) * strength
          }
        }
        p.dx += (tx - p.dx) * EASE
        p.dy += (ty - p.dy) * EASE
        energy += Math.abs(tx - p.dx) + Math.abs(ty - p.dy) + Math.abs(p.dx) + Math.abs(p.dy)
      }
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
      mouse.x = e.clientX
      mouse.y = e.clientY
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
