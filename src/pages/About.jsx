import { useEffect, useRef } from 'react'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import SiteRail from '../components/SiteRail'
import IndexRail from '../components/IndexRail'

const INDEX_ITEMS = [
  { num: '02', label: 'My Story / About Me' },
  { num: '03', label: 'Resume' },
  { num: '04', label: "What I'm Interested In" },
  { num: '05', label: 'The Tools' },
  { num: '06', label: 'Experience & Education' },
  { num: '07', label: 'Life Beyond Design' },
  { num: '08', label: 'Get in Touch' },
]

const RAIL_SECTIONS = [
  { label: 'The Hero Section' },
  { label: 'My Story / About Me' },
  { label: 'Resume' },
  { label: "What I'm Interested In" },
  { label: 'The Tools' },
  { label: 'Experience & Education' },
  { label: 'Life Beyond Design' },
  { label: 'Get in Touch' },
  { label: 'The Footer' },
]

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
      <SiteRail sections={RAIL_SECTIONS} />
      <div className="about-hero" id="about-hero" ref={heroRef}>
        <img
          className="about-hero__img"
          src="/about-hero.webp"
          alt=""
        />
        <div className="about-hero__scrim" />
        <div className="about-hero__bottom-fade" />
        <div className="about-hero__overlay" />
      </div>
      <section id="about-title" className="page-stub">
        <p className="page-stub__eyebrow">03 · ABOUT ME</p>
        <h1 className="page-stub__title">About Me</h1>
      </section>
      <IndexRail items={INDEX_ITEMS} />
      <SiteFooter />
    </>
  )
}
