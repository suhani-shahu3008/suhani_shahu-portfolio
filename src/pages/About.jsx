import { useEffect, useRef } from 'react'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'

export default function About() {
  const heroRef = useRef(null)

  useEffect(() => {
    const el = heroRef.current
    const onScroll = () => {
      const rect = el.getBoundingClientRect()
      const progress = Math.min(1, Math.max(0, -rect.top / rect.height))
      const fade = Math.min(1, Math.max(0, (progress - 0.45) / 0.55))
      el.style.setProperty('--zoom', 1 + progress * 0.22)
      el.style.setProperty('--fade', fade)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <SiteNav />
      <div className="about-hero" ref={heroRef}>
        <img
          className="about-hero__img"
          src="/about-hero.png"
          alt=""
        />
        <div className="about-hero__scrim" />
        <div className="about-hero__bottom-fade" />
        <div className="about-hero__overlay" />
      </div>
      <section className="page-stub">
        <p className="page-stub__eyebrow">03 · ABOUT ME</p>
        <h1 className="page-stub__title">About Me</h1>
      </section>
      <SiteFooter />
    </>
  )
}
