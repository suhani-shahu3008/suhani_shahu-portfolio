import { useEffect, useRef } from 'react'

const easeOut = (t) => 1 - Math.pow(1 - t, 2.2)

const AUTOPLAY_MS = 1100

export default function CaseStudiesFeatured({ projects }) {
  const outerRef = useRef(null)
  const stageRef = useRef(null)
  const captionRef = useRef(null)
  const featured = projects.slice(0, 4)

  useEffect(() => {
    featured.forEach((p) => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = p.image
      link.dataset.csFeaturedPreload = 'true'
      document.head.appendChild(link)
    })
    return () => {
      document
        .querySelectorAll('link[data-cs-featured-preload="true"]')
        .forEach((l) => l.remove())
    }
  }, [])

  // Scroll-driven pin + progressive scale. Which image is showing is
  // handled separately below, on its own timer — not tied to scroll.
  useEffect(() => {
    const outer = outerRef.current
    const stage = stageRef.current
    if (!outer || !stage) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      stage.style.position = 'relative'
      stage.style.top = '0px'
      stage.style.setProperty('--p', 0)
      stage.style.setProperty('--scale', 1)
      stage.style.setProperty('--dim', 0.5)
      stage.style.setProperty('--cap-op', 1)
      return
    }

    let ticking = false

    const update = () => {
      ticking = false
      const rect = outer.getBoundingClientRect()
      const vh = window.innerHeight
      const total = Math.max(1, rect.height - vh)
      const p = Math.min(1, Math.max(0, -rect.top / total))

      // Manual pin instead of position:sticky: html/body/#root carry
      // `overflow-x: hidden`, which per spec forces their computed
      // overflow-y to `auto` too — that makes #root the nearest
      // "scrolling ancestor" for sticky's containing-block calculation,
      // even though #root never actually scrolls (the page scrolls at the
      // html/documentElement level). Sticky ends up anchored to the wrong
      // box and never engages. Toggling fixed/absolute by hand sidesteps
      // that entirely.
      if (rect.top > 0) {
        stage.style.position = 'absolute'
        stage.style.top = '0px'
      } else if (rect.bottom - vh > 0) {
        stage.style.position = 'fixed'
        stage.style.top = '0px'
      } else {
        stage.style.position = 'absolute'
        stage.style.top = `${rect.height - vh}px`
      }

      const scale = 0.42 + easeOut(p) * (1.85 - 0.42)

      stage.style.setProperty('--p', p)
      stage.style.setProperty('--scale', scale)
      stage.style.setProperty('--dim', 0.35 + p * 0.55)
      stage.style.setProperty('--cap-op', p > 0.02 && p < 0.98 ? 1 : 0)
    }

    // Batch to one update per animation frame — writing styles straight off
    // the raw scroll event (which can fire many times per frame) is what
    // produces visible stutter/lag in scroll-pinned animations.
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(update)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    update()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  // Autoplay image cycle — runs on its own clock, independent of scroll.
  useEffect(() => {
    const stage = stageRef.current
    const caption = captionRef.current
    if (!stage) return

    const setActive = (idx) => {
      featured.forEach((_, i) => {
        stage.style.setProperty(`--o${i + 1}`, i === idx ? 1 : 0)
      })
      stage.dataset.active = String(idx)
      if (caption) caption.textContent = featured[idx].title
    }

    setActive(0)

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return

    let idx = 0
    const id = setInterval(() => {
      idx = (idx + 1) % featured.length
      setActive(idx)
    }, AUTOPLAY_MS)
    return () => clearInterval(id)
  }, [])

  return (
    <section
      id="cs-featured"
      className="cs-featured"
      ref={outerRef}
      aria-label="Featured work reel"
    >
      <div className="cs-featured__stage" ref={stageRef}>
        <div className="cs-featured__scrim" aria-hidden="true" />
        <div className="cs-featured__viz">
          {featured.map((p, i) => (
            <div
              key={p.id}
              className="cs-featured__slot"
              style={{ '--op': `var(--o${i + 1})` }}
              aria-hidden="true"
            >
              <img src={p.image} alt="" loading={i === 0 ? 'eager' : 'lazy'} />
            </div>
          ))}
        </div>
        <div className="cs-featured__caption" aria-hidden="true">
          <span className="dot" />
          <span className="k">
            Now Showing — <b ref={captionRef}>{featured[0].title}</b>
          </span>
        </div>
      </div>
    </section>
  )
}
