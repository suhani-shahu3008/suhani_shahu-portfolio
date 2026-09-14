import { useEffect } from 'react'

/* Ports the ambient "embers" field from Home's buildAtmosphere() in the Kage
   template (public/landing-pages/suhanishahu-portfolio.html) — the warm
   pink/white motes that drift slowly upward and scatter across the whole
   frame, independent of the cursor. That version is a WebGL shader tied to
   the temple scene's world space; this is a Canvas2D port using the same
   per-particle seed, vertical wrap-and-rise, horizontal sine/cosine jitter,
   and fade-in/out envelope, tuned to screen-space pixels instead of world
   units. */

const smoothstep = (edge0, edge1, x) => {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}

function makeEmberSprite() {
  const S = 128
  const c = document.createElement('canvas')
  c.width = S
  c.height = S
  const x = c.getContext('2d')
  const g = x.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2)
  g.addColorStop(0, 'rgba(255,225,238,1)')
  g.addColorStop(0.28, 'rgba(255,148,205,.55)')
  g.addColorStop(0.62, 'rgba(255,110,180,.14)')
  g.addColorStop(1, 'rgba(255,110,180,0)')
  x.fillStyle = g
  x.fillRect(0, 0, S, S)
  return c
}

export default function SiteAmbientEmbers() {
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const canvas = document.createElement('canvas')
    Object.assign(canvas.style, {
      position: 'fixed', inset: '0', width: '100%', height: '100%',
      pointerEvents: 'none', zIndex: '0',
    })
    document.body.insertBefore(canvas, document.body.firstChild)
    const ctx = canvas.getContext('2d')
    const sprite = makeEmberSprite()

    let dpr = Math.min(2, window.devicePixelRatio || 1)
    let vw = window.innerWidth
    let vh = window.innerHeight
    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1)
      vw = window.innerWidth
      vh = window.innerHeight
      canvas.width = vw * dpr
      canvas.height = vh * dpr
      canvas.style.width = vw + 'px'
      canvas.style.height = vh + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize, { passive: true })

    const coarse = matchMedia('(hover: none)').matches
    const N = coarse ? 16 : 30
    const RANGE = 1.0 /* normalized vertical wrap range, mapped to viewport height with overscan */
    const particles = Array.from({ length: N }, () => ({
      x: Math.random(),
      y: Math.random() * RANGE,
      seed: Math.random(),
    }))

    let raf
    let t = 0
    let last = performance.now()
    const OVERSCAN = 1.12

    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      t += dt

      ctx.clearRect(0, 0, vw, vh)
      ctx.globalCompositeOperation = 'lighter'

      for (const p of particles) {
        p.y = (p.y + dt * (0.05 + p.seed * 0.10)) % RANGE
        const prog = p.y / RANGE /* 0 = just spawned at bottom, 1 = about to wrap at top */

        const alpha = (0.16 + p.seed * 0.26) *
          smoothstep(1.0, 0.61, prog) *
          smoothstep(0, 0.122, prog)
        if (alpha <= 0.004) continue

        const px = (p.x + Math.sin(t * 0.36 + p.seed * 22) * 0.02) * vw
        const py = vh * OVERSCAN * (1 - prog) - vh * (OVERSCAN - 1) / 2
        const size = (5 + p.seed * 9) * (coarse ? 0.8 : 1)

        ctx.globalAlpha = alpha
        ctx.drawImage(sprite, px - size, py - size, size * 2, size * 2)
      }
      ctx.globalAlpha = 1

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(raf)
      canvas.remove()
    }
  }, [])

  return null
}
