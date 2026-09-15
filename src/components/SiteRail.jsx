import { useEffect, useRef, useState } from 'react'

const DEFAULT_SECTIONS = [
  { label: 'Hero Section' },
  { label: 'Case Studies' },
  { label: 'The Tools' },
  { label: 'About Me' },
  { label: 'Get in touch' },
  { label: 'The Footer' },
]

export default function SiteRail({ sections = DEFAULT_SECTIONS }) {
  const [active, setActive] = useState(0)
  const clickLockRef = useRef(false)

  useEffect(() => {
    const ids = sections.map((s) => s.id).filter(Boolean)
    if (!ids.length) return

    const els = ids.map((id) => document.getElementById(id)).filter(Boolean)
    if (!els.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (clickLockRef.current) return
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) {
          const idx = sections.findIndex((s) => s.id === visible.target.id)
          if (idx !== -1) setActive(idx)
        }
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [sections])

  const onClick = (s, i) => () => {
    setActive(i)
    if (!s.id) return
    clickLockRef.current = true
    document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    window.setTimeout(() => { clickLockRef.current = false }, 900)
  }

  return (
    <div className="rail" aria-hidden="true">
      {sections.map((s, i) => (
        <button
          key={s.label}
          type="button"
          className={i === active ? 'on' : ''}
          tabIndex={-1}
          onClick={onClick(s, i)}
        >
          <i />
          <span className="rail-tip">{s.label}</span>
        </button>
      ))}
    </div>
  )
}
