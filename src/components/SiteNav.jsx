import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const LOGO_LETTERS = ['S', 'u', 'h', 'a', 'n', 'i', ' ', 'S', 'h', 'a', 'h', 'u']

const NAV_LINKS = [
  { to: '/', label: 'Home', alt: 'ホーム' },
  { to: '/case-studies', label: 'Case Studies', alt: '事例' },
  { to: '/about-me', label: 'About Me', alt: '私について' },
]

/**
 * Exact port of the Home nav (`.nav` in
 * public/landing-pages/suhanishahu-portfolio.html) — same classes, same CSS
 * values (ported into the `.nav*` rules in src/index.css), same scroll/menu
 * behavior. No active-state class is applied to any link: the source nav only
 * ever gets `.on` from Home's own in-page scroll-spy, which doesn't run here.
 */
export default function SiteNav() {
  const navRef = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    const nav = navRef.current
    if (!nav) return
    document.documentElement.classList.toggle('nav-open', menuOpen)
    if (menuOpen) nav.classList.remove('hide')
    nav.classList.toggle('menu-open', menuOpen)
  }, [menuOpen])

  useEffect(() => {
    const nav = navRef.current
    if (!nav) return
    let last = 0
    const onScroll = () => {
      const y = window.scrollY
      nav.classList.toggle('stuck', y > 40)
      nav.classList.toggle(
        'hide',
        !nav.classList.contains('menu-open') && y > last + 4 && y > window.innerHeight * 0.8
      )
      last = y
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onKeydown = e => { if (e.key === 'Escape') setMenuOpen(false) }
    const onResize = () => { if (window.innerWidth > 820) setMenuOpen(false) }
    window.addEventListener('keydown', onKeydown)
    window.addEventListener('resize', onResize, { passive: true })
    return () => {
      window.removeEventListener('keydown', onKeydown)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <header className="nav" ref={navRef}>
      <Link className="nav-logo" to="/" data-cursor>
        {LOGO_LETTERS.map((ch, i) => (
          <span className="lt" key={i} style={{ '--i': i }}>{ch}</span>
        ))}
      </Link>

      <nav className="nav-links">
        {NAV_LINKS.map(({ to, label, alt }) => (
          <Link className="nav-link" to={to} key={to} data-cursor>
            <span>{label}</span>
            <span className="alt">{alt}</span>
          </Link>
        ))}
        <Link className="nav-link nav-cta" to="/get-in-touch" data-cursor>
          <span>Get in touch</span>
          <span className="nav-cta__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </Link>
      </nav>

      <button
        type="button"
        className={`nav-burger${menuOpen ? ' active' : ''}`}
        aria-label="Menu"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen(v => !v)}
        data-cursor
      >
        <i /><i />
      </button>
    </header>
  )
}
