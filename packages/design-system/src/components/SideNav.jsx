import { useState, useRef, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { HomeIcon, LayersIcon, UserIcon, MailIcon } from './icons/Icons'

const DEFAULT_ITEMS = [
  { to: '/', label: 'Home', Icon: HomeIcon },
  { to: '/case-studies', label: 'Case Studies', Icon: LayersIcon },
  { to: '/about-me', label: 'About Me', Icon: UserIcon },
  { to: '/get-in-touch', label: 'Get in Touch', Icon: MailIcon },
]

const COLLAPSED = 80
const EXPANDED = 210
const RANGE = EXPANDED - COLLAPSED
const SNAP_THRESHOLD = 0.4 // 40% of drag range to commit
const DRAG_START_PX = 6 // ignore jitter smaller than this — lets plain taps navigate

/**
 * Collapsed icon pill that expands into a labeled side nav on drag or hover
 * past the snap threshold. Requires a react-router-dom `<Router>` ancestor
 * (uses `NavLink`).
 *
 * @param {{ items?: Array<{ to: string, label: string, Icon: React.ComponentType }> }} props
 */
export default function SideNav({ items = DEFAULT_ITEMS }) {
  const [expanded, setExpanded] = useState(false)
  const [drag, setDrag] = useState(null) // { start: number, delta: number } while actively dragging
  const [pressedKey, setPressedKey] = useState(null) // `to` of item held down via keyboard (Space/Enter)
  const navRef = useRef(null)
  const pointerId = useRef(null)
  const startX = useRef(0)
  const isDragging = useRef(false)

  const width = drag
    ? Math.max(
        COLLAPSED,
        Math.min(EXPANDED, (expanded ? EXPANDED : COLLAPSED) + drag.delta)
      )
    : expanded
    ? EXPANDED
    : COLLAPSED

  const progress = (width - COLLAPSED) / RANGE // 0..1

  // Grab anywhere on the pill — icons, labels, empty space — and stretch
  // it horizontally to expand. A plain tap (no real movement) still
  // navigates normally.
  //
  // Pointer capture is only engaged once a real drag starts (movement past
  // DRAG_START_PX). Capturing on every press — even a plain tap — makes the
  // browser retarget the resulting `click` event to the capturing element
  // instead of the link underneath it, which silently breaks navigation.
  const onPointerDown = e => {
    pointerId.current = e.pointerId
    startX.current = e.clientX
    isDragging.current = false
  }

  const onPointerMove = e => {
    if (pointerId.current !== e.pointerId) return
    const delta = e.clientX - startX.current
    if (!isDragging.current) {
      if (Math.abs(delta) < DRAG_START_PX) return
      isDragging.current = true
      try {
        e.currentTarget.setPointerCapture(e.pointerId)
      } catch {}
    }
    setDrag({ start: startX.current, delta })
  }

  const onPointerUp = e => {
    if (pointerId.current !== e.pointerId) return
    if (isDragging.current) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId)
      } catch {}
    }
    pointerId.current = null
    if (!isDragging.current) return
    setDrag(d => {
      if (!d) return null
      const nextWidth = Math.max(
        COLLAPSED,
        Math.min(EXPANDED, (expanded ? EXPANDED : COLLAPSED) + d.delta)
      )
      const nextProgress = (nextWidth - COLLAPSED) / RANGE
      setExpanded(nextProgress >= SNAP_THRESHOLD)
      return null
    })
  }

  // A real drag shouldn't also fire navigation on whatever link was under
  // the pointer.
  const onClickCapture = e => {
    if (isDragging.current) {
      e.preventDefault()
      e.stopPropagation()
      isDragging.current = false
    }
  }

  // Collapse when clicking outside while expanded
  useEffect(() => {
    if (!expanded) return
    const onDoc = e => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setExpanded(false)
      }
    }
    document.addEventListener('pointerdown', onDoc)
    return () => document.removeEventListener('pointerdown', onDoc)
  }, [expanded])

  const showLabels = progress > 0.35

  return (
    <nav
      ref={navRef}
      className="side-nav"
      data-expanded={showLabels ? 'true' : 'false'}
      data-dragging={drag ? 'true' : 'false'}
      style={{
        width: `${width}px`,
        transition: drag ? 'none' : undefined,
      }}
      aria-label="Primary"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onClickCapture={onClickCapture}
    >
      <div
        className="side-nav__inner"
        style={{ transition: drag ? 'none' : undefined }}
      >
        <ul className="side-nav__list">
          {items.map(({ to, label, Icon }, i) => (
            <li key={to} style={{ '--i': i }}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  'side-nav__item' +
                  (isActive ? ' is-active' : '') +
                  (pressedKey === to ? ' is-pressed' : '')
                }
                onKeyDown={e => {
                  if (e.key === ' ' || e.key === 'Enter') {
                    if (e.key === ' ') e.preventDefault()
                    setPressedKey(to)
                  } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                    e.preventDefault()
                    const dir = e.key === 'ArrowDown' ? 1 : -1
                    const next = (i + dir + items.length) % items.length
                    const nextEl = navRef.current?.querySelectorAll(
                      '.side-nav__item'
                    )[next]
                    nextEl?.focus()
                  }
                }}
                onKeyUp={e => {
                  if (e.key === ' ' || e.key === 'Enter') setPressedKey(null)
                }}
                onBlur={() => setPressedKey(null)}
              >
                <span className="side-nav__icon" aria-hidden>
                  <Icon />
                </span>
                <span className="side-nav__label">{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
