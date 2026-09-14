import { Routes, Route } from 'react-router-dom'
import SideNav from './components/SideNav'
import ResumeButton from './components/ResumeButton'
import Home from './pages/Home'
import WorkIndex from './pages/WorkIndex'
import CaseStudy from './pages/CaseStudy'
import About from './pages/About'

export default function App() {
  return (
    <div className="app-shell">
      <ResumeButton />
      <SideNav />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/work" element={<WorkIndex />} />
          <Route path="/work/:slug" element={<CaseStudy />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
    </div>
  )
}
