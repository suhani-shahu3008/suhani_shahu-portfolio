import { useEffect, useRef } from 'react'

const BG = '#0b0a0d'
const PINK = [246, 160, 181]
const GRAY = [186, 186, 190]
const TILE = 160 // px — repeating static grain-texture tile
const TILE_DENSITY = 260 // px^2 per grain speck inside the tile
const DUST_DENSITY = 9000 // px^2 per interactive dust particle
const CURSOR_RADIUS = 70
const MAX_PUSH = 7
const EASE = 0.12
const SETTLE_EPSILON = 0.03

function buildGrainTile() {
  const tile = document.createElement('canvas')
  tile.width = TILE
  tile.height = TILE
  const tctx = tile.getContext('2d')
  const count = Math.round((TILE * TILE) / TILE_DENSITY)
  for (let i = 0; i < count; i++) {
    const isPink = Math.random() < 0.75
    const [r, g, b] = isPink ? PINK : GRAY
    const a = isPink ? Math.random() * 0.09 + 0.03 : Math.random() * 0.05 + 0.02
    const radius = Math.random() * 0.55 + 0.25
    tctx.beginPath()
    tctx.fillStyle = `rgba(${r},${g},${b},${a})`
    tctx.arc(Math.random() * TILE, Math.random() * TILE, radius, 0, Math.PI * 2)
    tctx.fill()
  }
  return tile
}

/**
 * Full-viewport, fixed, canvas-based dust field for the Get in Touch page.
 * Two layers, both painted every frame but cheap:
 *  - a static, tileable grain texture (fine, dense, never moves) that gives
 *    the whole viewport its atmosphere
 *  - a sparse set of slightly larger dust particles that stay put until the
 *    cursor passes near them, then ease back to rest. No continuous
 *    animation loop — rAF only runs while particles are still settling.
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
    let pattern = null
    let mouse = { x: -9999, y: -9999 }
    let raf = null

    const makeParticles = () => {
      const area = window.innerWidth * window.innerHeight
      const count = Math.round(area / DUST_DENSITY)
      particles = new Array(count).fill(0).map(() => {
        const isPink = Math.random() < 0.78
        const [r, g, b] = isPink ? PINK : GRAY
        return {
          ox: Math.random() * window.innerWidth,
          oy: Math.random() * window.innerHeight,
          dx: 0,
          dy: 0,
          r: Math.random() * 0.7 + 0.4,
          a: isPink ? Math.random() * 0.1 + 0.05 : Math.random() * 0.06 + 0.03,
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
      pattern = ctx.createPattern(buildGrainTile(), 'repeat')
      makeParticles()
      draw()
    }

    const draw = () => {
      ctx.fillStyle = BG
      ctx.fillRect(0, 0, width, height)
      if (pattern) {
        ctx.fillStyle = pattern
        ctx.fillRect(0, 0, width, height)
      }
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
