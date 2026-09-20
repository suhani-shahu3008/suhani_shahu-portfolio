import { useEffect, useRef } from 'react'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import SiteRail from '../components/SiteRail'

const RAIL_SECTIONS = [
  { label: 'The Hero Section', id: 'gt-hero' },
  { label: 'Footer', id: 'site-footer' },
]

export default function Contact() {
  const heroRef = useRef(null)

  useEffect(() => {
    const el = heroRef.current
    if (!el) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const onScroll = () => {
      const rect = el.getBoundingClientRect()
      const progress = Math.min(1, Math.max(0, -rect.top / rect.height))
      const fade = Math.min(1, Math.max(0, (progress - 0.45) / 0.55))
      el.style.setProperty('--zoom', 1 + progress * 0.14)
      el.style.setProperty('--fade', fade)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    if (reduceMotion) {
      return () => window.removeEventListener('scroll', onScroll)
    }

    let raf = null
    const onPointerMove = e => {
      const rect = el.getBoundingClientRect()
      const px = (e.clientX - rect.left) / rect.width - 0.5
      const py = (e.clientY - rect.top) / rect.height - 0.5
      if (raf) cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        el.style.setProperty('--px', px.toFixed(3))
        el.style.setProperty('--py', py.toFixed(3))
      })
    }
    const onPointerLeave = () => {
      el.style.setProperty('--px', 0)
      el.style.setProperty('--py', 0)
    }
    el.addEventListener('pointermove', onPointerMove)
    el.addEventListener('pointerleave', onPointerLeave)

    return () => {
      window.removeEventListener('scroll', onScroll)
      el.removeEventListener('pointermove', onPointerMove)
      el.removeEventListener('pointerleave', onPointerLeave)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <SiteNav />
      <SiteRail sections={RAIL_SECTIONS} />

      <div className="gt-hero" id="gt-hero" ref={heroRef}>
        <div className="gt-hero__world">
          <img className="gt-hero__img" src="/gt-hero.webp" alt="" />
          <div className="gt-hero__clouds" />
          <div className="gt-hero__ufo gt-hero__ufo--1" />
          <div className="gt-hero__ufo gt-hero__ufo--2" />
          <div className="gt-hero__ufo gt-hero__ufo--3" />
          <div className="gt-hero__train" />
        </div>
        <div className="gt-hero__scrim" />
        <div className="gt-hero__bottom-fade" />
        <div className="gt-hero__overlay" />
        <div className="gt-hero__content">
          <p className="page-stub__eyebrow">04 · GET IN TOUCH</p>
          <h1 className="page-stub__title">Get in Touch</h1>
        </div>
      </div>

      <SiteFooter />
    </>
  )
}
