import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import WorkIndex from './pages/WorkIndex'
import CaseStudy from './pages/CaseStudy'
import About from './pages/About'
import Contact from './pages/Contact'
import SiteCursor from './components/SiteCursor'
import SiteCursorWisps from './components/SiteCursorWisps'
import SiteAmbientEmbers from './components/SiteAmbientEmbers'

export default function App() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <div className="app-shell">
      {/* Home runs its own cursor, wisps, and embers inside the Kage iframe */}
      {!isHome && <SiteAmbientEmbers />}
      {!isHome && <SiteCursor />}
      {!isHome && <SiteCursorWisps />}
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/case-studies" element={<WorkIndex />} />
          <Route path="/case-studies/:slug" element={<CaseStudy />} />
          <Route path="/about-me" element={<About />} />
          <Route path="/get-in-touch" element={<Contact />} />
        </Routes>
      </main>
    </div>
  )
}
