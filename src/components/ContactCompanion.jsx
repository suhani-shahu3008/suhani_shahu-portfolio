import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/**
 * Small floating glass-headed character for the Get in Touch hero. Its eyes
 * track the cursor anywhere on the page; own isolated three.js scene on its
 * own canvas, independent of everything else on this route.
 */
export default function ContactCompanion() {
  const mountRef = useRef(null)

  useEffect(() => {
    const holder = mountRef.current
    if (!holder) return

    const REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches

    const canvas = document.createElement('canvas')
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    canvas.style.display = 'block'
    holder.appendChild(canvas)

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' })
    renderer.setClearColor(0x000000, 0)
    if ('outputColorSpace' in renderer) renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 30)
    camera.position.set(0, 0.15, 5.6)
    camera.lookAt(0, 0, 0)

    /* ---- a tiny baked environment, just for soft glass reflections ---- */
    const envCanvas = document.createElement('canvas')
    envCanvas.width = 16
    envCanvas.height = 64
    const ectx = envCanvas.getContext('2d')
    const grad = ectx.createLinearGradient(0, 0, 0, 64)
    grad.addColorStop(0, '#3a1830')
    grad.addColorStop(0.45, '#180c16')
    grad.addColorStop(1, '#0d0a12')
    ectx.fillStyle = grad
    ectx.fillRect(0, 0, 16, 64)
    const envTex = new THREE.CanvasTexture(envCanvas)
    envTex.mapping = THREE.EquirectangularReflectionMapping

    const pmrem = new THREE.PMREMGenerator(renderer)
    const envScene = new THREE.Scene()
    envScene.background = envTex
    const keyPanel = new THREE.Mesh(
      new THREE.PlaneGeometry(5, 5),
      new THREE.MeshBasicMaterial({ color: 0xffcfe3 })
    )
    keyPanel.position.set(2.4, 1.6, 1.4)
    keyPanel.rotation.y = -0.6
    envScene.add(keyPanel)
    const rimPanel = new THREE.Mesh(
      new THREE.PlaneGeometry(4, 4),
      new THREE.MeshBasicMaterial({ color: 0x7a2f52 })
    )
    rimPanel.position.set(-2.6, 0.4, -1.2)
    rimPanel.rotation.y = 0.9
    envScene.add(rimPanel)
    const envMap = pmrem.fromScene(envScene, 0.03).texture
    scene.environment = envMap
    pmrem.dispose()
    keyPanel.geometry.dispose()
    keyPanel.material.dispose()
    rimPanel.geometry.dispose()
    rimPanel.material.dispose()
    envTex.dispose()

    /* ---- lights ---- */
    scene.add(new THREE.AmbientLight(0x3a1830, 1.1))
    const key = new THREE.PointLight(0xf6b8d1, 7, 12, 2)
    key.position.set(2.1, 2.4, 2.8)
    scene.add(key)
    const rim = new THREE.PointLight(0xd1477e, 2.6, 10, 2)
    rim.position.set(-2, -0.6, -1.6)
    scene.add(rim)

    /* ---- the character ---- */
    const rig = new THREE.Group()
    scene.add(rig)

    // a faint horizon glow at the base — an abstract stand-in for "the
    // ground", just enough to read as a surface without drawing literal terrain
    const groundCanvas = document.createElement('canvas')
    groundCanvas.width = groundCanvas.height = 256
    const grctx = groundCanvas.getContext('2d')
    const gg = grctx.createRadialGradient(128, 150, 0, 128, 150, 150)
    gg.addColorStop(0, 'rgba(80,30,58,.55)')
    gg.addColorStop(0.55, 'rgba(50,18,38,.24)')
    gg.addColorStop(1, 'rgba(30,12,24,0)')
    grctx.fillStyle = gg
    grctx.fillRect(0, 0, 256, 256)
    const groundTex = new THREE.CanvasTexture(groundCanvas)
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(5, 2.6),
      new THREE.MeshBasicMaterial({ map: groundTex, transparent: true, depthWrite: false, opacity: 0.85 })
    )
    ground.position.set(-0.15, -1.35, -0.85)
    rig.add(ground)

    // glowing orb body — offset low-left, a warm pink bloom rather than a
    // literal solid form, floating just above the ground line
    const bodyGroup = new THREE.Group()
    bodyGroup.position.set(-0.32, -0.62, 0.1)
    rig.add(bodyGroup)

    const haloCanvas = document.createElement('canvas')
    haloCanvas.width = haloCanvas.height = 128
    const hctx = haloCanvas.getContext('2d')
    const hg = hctx.createRadialGradient(64, 64, 0, 64, 64, 64)
    hg.addColorStop(0, 'rgba(255,196,222,.5)')
    hg.addColorStop(0.5, 'rgba(246,184,209,.22)')
    hg.addColorStop(1, 'rgba(246,184,209,0)')
    hctx.fillStyle = hg
    hctx.fillRect(0, 0, 128, 128)
    const haloTex = new THREE.CanvasTexture(haloCanvas)
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({
      map: haloTex, transparent: true, blending: THREE.AdditiveBlending,
      depthWrite: false, opacity: 0.85,
    }))
    halo.scale.set(2.6, 2.6, 1)
    bodyGroup.add(halo)

    const bodyMat = new THREE.MeshPhysicalMaterial({
      color: 0xff9dc3, roughness: 0.3, metalness: 0,
      clearcoat: 0.6, clearcoatRoughness: 0.25,
      sheen: 1, sheenColor: new THREE.Color(0xffe1ec), sheenRoughness: 0.7,
      emissive: 0xff5f9e, emissiveIntensity: 0.55,
    })
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.44, 48, 48), bodyMat)
    bodyGroup.add(body)

    // soft pink floor glow beneath the orb
    const glowCanvas = document.createElement('canvas')
    glowCanvas.width = glowCanvas.height = 128
    const gctx = glowCanvas.getContext('2d')
    const rg = gctx.createRadialGradient(64, 64, 0, 64, 64, 64)
    rg.addColorStop(0, 'rgba(246,184,209,.5)')
    rg.addColorStop(0.55, 'rgba(209,71,126,.16)')
    rg.addColorStop(1, 'rgba(209,71,126,0)')
    gctx.fillStyle = rg
    gctx.fillRect(0, 0, 128, 128)
    const glowTex = new THREE.CanvasTexture(glowCanvas)
    const glow = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.MeshBasicMaterial({
        map: glowTex, transparent: true, blending: THREE.AdditiveBlending,
        depthWrite: false, opacity: 0.55,
      })
    )
    glow.rotation.x = -Math.PI / 2
    glow.position.y = -0.7
    bodyGroup.add(glow)

    // glass head — offset up-right, overlapping the orb's halo like the
    // reference's diagonal head/body arrangement
    const headGroup = new THREE.Group()
    headGroup.position.set(0.34, 0.5, 0)
    rig.add(headGroup)

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x150d18, roughness: 0.06, metalness: 0,
      transmission: 1, thickness: 0.9, ior: 1.35,
      attenuationColor: new THREE.Color(0x3a1830), attenuationDistance: 1.6,
      clearcoat: 1, clearcoatRoughness: 0.08,
      envMapIntensity: 1.3,
    })
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.6, 64, 64), glassMat)
    headGroup.add(head)

    // thin luminous edge
    const rimEdge = new THREE.Mesh(
      new THREE.SphereGeometry(0.605, 32, 32),
      new THREE.MeshBasicMaterial({
        color: 0xf6b8d1, transparent: true, opacity: 0.18,
        side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false,
      })
    )
    headGroup.add(rimEdge)

    // eyes — two soft pink pills, aimed at the cursor
    const eyesPivot = new THREE.Group()
    eyesPivot.position.z = 0.06
    headGroup.add(eyesPivot)
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffa8c9 })
    const eyeGeo = new THREE.CapsuleGeometry(0.047, 0.1, 4, 8)
    const eyeL = new THREE.Mesh(eyeGeo, eyeMat)
    const eyeR = new THREE.Mesh(eyeGeo, eyeMat)
    eyeL.position.set(-0.155, 0.02, 0.52)
    eyeR.position.set(0.155, 0.02, 0.52)
    eyesPivot.add(eyeL, eyeR)

    /* ---- sizing ---- */
    function resize() {
      const r = holder.getBoundingClientRect()
      const w = Math.max(1, r.width)
      const h = Math.max(1, r.height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8))
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(holder)

    /* ---- cursor tracking (site-wide, like the reference) ---- */
    const mouse = { x: 0, y: 0 }
    const eyeTarget = { x: 0, y: 0 }
    const eyeSmooth = { x: 0, y: 0 }
    const tiltSmooth = { x: 0, y: 0 }
    const onMove = (e) => {
      mouse.x = (e.clientX / innerWidth) * 2 - 1
      mouse.y = (e.clientY / innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    const MAX_EYE_YAW = 0.34
    const MAX_EYE_PITCH = 0.22
    const MAX_TILT = 0.1

    let visible = true
    const io = new IntersectionObserver((entries) => { visible = entries[0].isIntersecting }, { threshold: 0.01 })
    io.observe(holder)

    let running = true
    let raf = 0
    let prev = performance.now()
    const frame = (now) => {
      if (!running) return
      raf = requestAnimationFrame(frame)
      if (!visible) { prev = now; return }
      const dt = Math.min(0.05, (now - prev) / 1000)
      prev = now
      const t = now / 1000

      eyeTarget.x = THREE.MathUtils.clamp(mouse.x, -1, 1) * MAX_EYE_YAW
      eyeTarget.y = THREE.MathUtils.clamp(-mouse.y, -1, 1) * MAX_EYE_PITCH

      const ease = REDUCE ? 1 : 1 - Math.pow(0.001, dt)
      eyeSmooth.x += (eyeTarget.x - eyeSmooth.x) * ease
      eyeSmooth.y += (eyeTarget.y - eyeSmooth.y) * ease
      tiltSmooth.x += (eyeTarget.y * (MAX_TILT / MAX_EYE_PITCH) - tiltSmooth.x) * ease * 0.6
      tiltSmooth.y += (eyeTarget.x * (MAX_TILT / MAX_EYE_YAW) - tiltSmooth.y) * ease * 0.6

      eyesPivot.rotation.y = eyeSmooth.x
      eyesPivot.rotation.x = -eyeSmooth.y

      if (!REDUCE) {
        rig.position.y = -0.05 + Math.sin(t * 0.62) * 0.08
        rig.rotation.z = Math.sin(t * 0.4) * 0.02
        const breathe = 1 + Math.sin(t * 0.9) * 0.02
        body.scale.setScalar(breathe)
        halo.material.opacity = 0.7 + Math.sin(t * 1.3) * 0.15
        bodyGroup.position.y = -0.62 + Math.sin(t * 0.8 + 1.1) * 0.03
        headGroup.rotation.x = tiltSmooth.x
        headGroup.rotation.y = tiltSmooth.y * 0.6
      }

      renderer.render(scene, camera)
    }
    raf = requestAnimationFrame(frame)

    const onVisibility = () => {
      running = !document.hidden
      if (running) { prev = performance.now(); raf = requestAnimationFrame(frame) }
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pointermove', onMove)
      ro.disconnect()
      io.disconnect()
      envMap.dispose()
      glowTex.dispose()
      haloTex.dispose()
      groundTex.dispose()
      renderer.dispose()
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose()
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose())
          else obj.material.dispose()
        }
      })
      holder.removeChild(canvas)
    }
  }, [])

  return <div className="gt-hero__companion-canvas" ref={mountRef} aria-hidden="true" />
}
