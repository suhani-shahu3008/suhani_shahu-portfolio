import { useEffect, useRef } from 'react'

const smooth = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

function makeMoteSprite() {
  const S = 128
  const c = document.createElement('canvas')
  c.width = S
  c.height = S
  const x = c.getContext('2d')
  const g = x.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.07, 'rgba(255,240,245,.92)')
  g.addColorStop(0.16, 'rgba(255,201,217,.40)')
  g.addColorStop(0.34, 'rgba(247,166,196,.13)')
  g.addColorStop(0.62, 'rgba(224,120,160,.035)')
  g.addColorStop(1, 'rgba(200,100,142,0)')
  x.fillStyle = g
  x.fillRect(0, 0, S, S)
  return c
}

export default function SiteCursorWisps() {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (matchMedia('(hover: none)').matches) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const sprite = makeMoteSprite()

    let dpr = Math.min(2, window.devicePixelRatio || 1)
    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = window.innerWidth + 'px'
      canvas.style.height = window.innerHeight + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize, { passive: true })

    const N = 140
    const list = Array.from({ length: N }, () => ({
      x: 0, y: 0, vx: 0, vy: 0, life: 0, max: 1, sz: 0, ph: 0, active: false,
    }))
    let ring = 0

    const state = { ex: 0, ey: 0, lx: 0, ly: 0, seen: false, acc: 0, idle: 0 }

    const spawn = (x, y, ang, weak) => {
      const i = ring
      ring = (ring + 1) % N
      const w = list[i]
      w.x = x + (Math.random() + Math.random() - 1) * 6
      w.y = y + (Math.random() + Math.random() - 1) * 6
      w.life = 0
      w.max = (weak ? 1.9 : 1.3) + Math.random() * 1.1
      w.vx = -Math.cos(ang) * 6 + (Math.random() - 0.5) * 24
      w.vy = -Math.sin(ang) * 6 + (Math.random() - 0.5) * 20
      w.sz = (weak ? 7 : 10) + Math.random() * 11
      w.ph = Math.random() * Math.PI * 2
      w.active = true
    }

    const onMove = (e) => {
      state.ex = e.clientX
      state.ey = e.clientY
      if (!state.seen) { state.lx = state.ex; state.ly = state.ey; state.seen = true }
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    let raf
    let last = performance.now()
    const STEP = 9

    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now

      if (state.seen) {
        const dx = state.ex - state.lx
        const dy = state.ey - state.ly
        const moved = Math.hypot(dx, dy)
        const ang = moved > 0.5 ? Math.atan2(dy, dx) : 0

        state.acc += moved
        let guard = 0
        while (state.acc >= STEP && guard++ < 20) {
          state.acc -= STEP
          const t = moved > 0.001 ? Math.min(1, guard * STEP / moved) : 0
          spawn(state.lx + dx * t, state.ly + dy * t, ang, false)
        }

        state.idle += dt
        if (state.idle > 0.42) {
          state.idle = 0
          spawn(state.ex, state.ey, Math.random() * Math.PI * 2, true)
        }
        state.lx = state.ex
        state.ly = state.ey
      }

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      ctx.globalCompositeOperation = 'lighter'

      const clock = now / 1000
      for (let i = 0; i < N; i++) {
        const w = list[i]
        if (!w.active) continue
        if (w.life >= w.max) { w.active = false; continue }
        w.life += dt
        const u = w.life / w.max

        w.x += (w.vx + Math.sin(clock * 1.3 + w.ph) * 14) * dt
        w.y += (w.vy + Math.cos(clock * 1.1 + w.ph * 1.7) * 12) * dt
        w.vx *= 1 - 0.5 * dt
        w.vy = w.vy * (1 - 0.5 * dt) - 3 * dt

        const alpha = smooth(0, 0.12, u) * (1 - smooth(0.22, 1, u)) * 0.85
        if (alpha <= 0.002) continue
        const size = w.sz * (1 + u * 0.55)

        ctx.globalAlpha = alpha
        ctx.drawImage(sprite, w.x - size, w.y - size, size * 2, size * 2)
      }
      ctx.globalAlpha = 1

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9998,
      }}
    />
  )
}
