import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import WorkIndex from './pages/WorkIndex'
import CaseStudy from './pages/CaseStudy'
import About from './pages/About'
import Contact from './pages/Contact'
import SiteCursor from './components/SiteCursor'

export default function App() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <div className="app-shell">
      {/* Home runs its own cursor inside the Kage iframe */}
      {!isHome && <SiteCursor />}
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
