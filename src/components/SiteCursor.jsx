import { useEffect, useRef } from 'react'

const lerp = (a, b, t) => a + (b - a) * t

/**
 * Exact port of Home's custom cursor (`.cur-dot`/`#cursor` + `wireCursor()`
 * in public/landing-pages/suhanishahu-portfolio.html): a lerped ring that
 * follows the pointer and swells over any `[data-cursor]` element. Hidden on
 * touch devices, same as the source (`matchMedia('(hover: none)')`).
 */
export default function SiteCursor() {
  const dotRef = useRef(null)

  useEffect(() => {
    if (matchMedia('(hover: none)').matches) return
    const dot = dotRef.current
    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let tx = x
    let ty = y
    let raf

    const onMove = e => { tx = e.clientX; ty = e.clientY }
    window.addEventListener('pointermove', onMove, { passive: true })

    const onOver = e => {
      if (e.target.closest('[data-cursor]')) dot.classList.add('act')
    }
    const onOut = e => {
      const to = e.relatedTarget
      if (!(to && to.closest && to.closest('[data-cursor]'))) dot.classList.remove('act')
    }
    document.addEventListener('pointerover', onOver)
    document.addEventListener('pointerout', onOut)

    const tick = () => {
      x = lerp(x, tx, .18)
      y = lerp(y, ty, .18)
      dot.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`
      raf = requestAnimationFrame(tick)
    }
    tick()

    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver)
      document.removeEventListener('pointerout', onOut)
      cancelAnimationFrame(raf)
    }
  }, [])

  return <div className="cur-dot" ref={dotRef} />
}
