import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
const sat = (v) => clamp(v, 0, 1)
const lerp = (a, b, t) => a + (b - a) * t
const smooth = (e0, e1, x) => { const t = sat((x - e0) / (e1 - e0)); return t * t * (3 - 2 * t) }
const damp = (cur, to, rate, dt) => lerp(cur, to, 1 - Math.exp(-rate * dt))

const WISP_D = 3.4

function texWisp() {
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

/**
 * Full-viewport WebGL trailing "wisp" particle effect that follows the
 * pointer. Disabled on touch devices and under reduced-motion. Decorative,
 * full-viewport fixed-position effect — mount once near the app root.
 */
export default function SiteCursorWisps() {
  const mountRef = useRef(null)

  useEffect(() => {
    if (matchMedia('(hover: none)').matches) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const vpW = () => document.documentElement.clientWidth || innerWidth
    const vpH = () => document.documentElement.clientHeight || innerHeight

    const canvas = document.createElement('canvas')
    Object.assign(canvas.style, {
      position: 'fixed', inset: '0', width: '100%', height: '100%',
      pointerEvents: 'none', zIndex: 9998,
    })
    mountRef.current.appendChild(canvas)

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' })
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1))
    renderer.setSize(vpW(), vpH())
    renderer.setClearColor(0x000000, 0)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(36, vpW() / vpH(), 0.35, 220)
    scene.add(camera)

    const texture = new THREE.CanvasTexture(texWisp())
    if ('colorSpace' in texture) texture.colorSpace = THREE.SRGBColorSpace

    const N = 190
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(N * 3), 3))
    g.setAttribute('aA', new THREE.BufferAttribute(new Float32Array(N), 1))
    g.setAttribute('aS', new THREE.BufferAttribute(new Float32Array(N), 1))
    const pts = new THREE.Points(g, new THREE.ShaderMaterial({
      uniforms: { uTex: { value: texture }, uPx: { value: vpH() * renderer.getPixelRatio() } },
      transparent: true, blending: THREE.AdditiveBlending,
      depthWrite: false, depthTest: false, fog: false,
      vertexShader:
        'attribute float aA; attribute float aS;\n' +
        'uniform float uPx; varying float vA;\n' +
        'void main(){ vA = aA;\n' +
        ' vec4 mv = modelViewMatrix * vec4(position,1.0);\n' +
        ' gl_PointSize = uPx * aS / max(-mv.z, 0.4);\n' +
        ' gl_Position = projectionMatrix * mv; }',
      fragmentShader:
        'uniform sampler2D uTex; varying float vA;\n' +
        'void main(){ if (vA <= 0.0) discard;\n' +
        ' vec4 t = texture2D(uTex, gl_PointCoord);\n' +
        ' gl_FragColor = vec4(t.rgb, t.a * vA); }',
    }))
    pts.frustumCulled = false
    pts.renderOrder = 9
    camera.add(pts)

    const WISP = { list: [], i: 0, acc: 0, ex: 0, ey: 0, lx: 0, ly: 0, idle: 0, seen: false }
    for (let i = 0; i < N; i++) WISP.list.push({ life: 0, max: 1, vx: 0, vy: 0, sz: 0, ph: 0 })

    const wispPoint = (nx, ny) => {
      const hh = Math.tan((camera.fov * Math.PI) / 360) * WISP_D
      return [nx * hh * camera.aspect, ny * hh]
    }

    const RIG = { tmx: 0, tmy: 0 }
    const onMove = (e) => {
      RIG.tmx = (e.clientX / vpW()) * 2 - 1
      RIG.tmy = -((e.clientY / vpH()) * 2 - 1)
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    let clock = 0
    const updateWisps = (dt) => {
      clock += dt
      const P = g.attributes.position.array
      const A = g.attributes.aA.array
      const S = g.attributes.aS.array
      const L = WISP.list
      const NN = L.length

      const pt = wispPoint(RIG.tmx, RIG.tmy)
      if (!WISP.seen) { WISP.ex = WISP.lx = pt[0]; WISP.ey = WISP.ly = pt[1]; WISP.seen = true }
      WISP.ex = damp(WISP.ex, pt[0], 16, dt)
      WISP.ey = damp(WISP.ey, pt[1], 16, dt)

      const dx = WISP.ex - WISP.lx
      const dy = WISP.ey - WISP.ly
      const moved = Math.hypot(dx, dy)
      const ang = moved > 1e-5 ? Math.atan2(dy, dx) : 0

      const spawn = (x, y, a, weak) => {
        const i = WISP.i
        WISP.i = (i + 1) % NN
        const w = L[i]
        const k = i * 3
        P[k] = x + (Math.random() + Math.random() - 1) * 0.3
        P[k + 1] = y + (Math.random() + Math.random() - 1) * 0.3
        P[k + 2] = -WISP_D + (Math.random() - 0.5) * 0.9
        w.life = 0
        w.max = (weak ? 2.1 : 1.45) + Math.random() * 1.3
        w.vx = -Math.cos(a) * 0.09 + (Math.random() - 0.5) * 0.38
        w.vy = -Math.sin(a) * 0.09 + (Math.random() - 0.5) * 0.32 + 0.02
        w.sz = (weak ? 0.024 : 0.032) + Math.random() * 0.034
        w.ph = Math.random() * Math.PI * 2
      }

      WISP.acc += moved
      const STEP = 0.03
      let guard = 0
      while (WISP.acc >= STEP && guard++ < 14) {
        WISP.acc -= STEP
        const t = moved > 1e-6 ? Math.min(1, (guard * STEP) / moved) : 0
        spawn(WISP.lx + dx * t, WISP.ly + dy * t, ang, false)
      }

      WISP.idle += dt
      if (WISP.idle > 0.42) { WISP.idle = 0; spawn(WISP.ex, WISP.ey, Math.random() * Math.PI * 2, true) }
      WISP.lx = WISP.ex
      WISP.ly = WISP.ey

      for (let i = 0; i < NN; i++) {
        const w = L[i]
        const k = i * 3
        if (w.life >= w.max) { A[i] = 0; continue }
        w.life += dt
        const u = w.life / w.max
        P[k] += (w.vx + Math.sin(clock * 1.3 + w.ph) * 0.17) * dt
        P[k + 1] += (w.vy + Math.cos(clock * 1.1 + w.ph * 1.7) * 0.14) * dt
        w.vx *= 1 - 0.5 * dt
        w.vy = w.vy * (1 - 0.5 * dt) + 0.022 * dt
        A[i] = smooth(0, 0.12, u) * (1 - smooth(0.22, 1, u)) * 0.9
        S[i] = w.sz * (1 + u * 0.55)
      }
      g.attributes.position.needsUpdate = true
      g.attributes.aA.needsUpdate = true
      g.attributes.aS.needsUpdate = true
    }

    const resize = () => {
      camera.aspect = vpW() / vpH()
      camera.updateProjectionMatrix()
      renderer.setSize(vpW(), vpH())
      pts.material.uniforms.uPx.value = vpH() * renderer.getPixelRatio()
    }
    window.addEventListener('resize', resize, { passive: true })

    let raf
    let last = performance.now()
    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      updateWisps(dt)
      renderer.render(scene, camera)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(raf)
      g.dispose()
      pts.material.dispose()
      texture.dispose()
      renderer.dispose()
      mountRef.current?.removeChild(canvas)
    }
  }, [])

  return <div ref={mountRef} />
}
