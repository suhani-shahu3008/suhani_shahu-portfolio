import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { KageLandingPage } from '@designcodeio/threeui'
import '@designcodeio/threeui/style.css'
import SiteNav from '../components/SiteNav'

export default function Home() {
  const navigate = useNavigate()

  useEffect(() => {
    const onMessage = (e) => {
      const route = e.data?.kageNav
      if (typeof route === 'string') navigate(route)
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [navigate])

  return (
    <>
      {/* The Kage iframe no longer draws its own nav — this is the same
          SiteNav every other page uses, overlaid above the 3D scene. It
          doesn't see the iframe's internal scroll, so it stays in its
          default (non-"stuck") state rather than hiding/showing on scroll. */}
      <SiteNav />
      <div className="home-hero">
        <KageLandingPage
          headingFont="onest"
          bodyFont="onest"
          headingWeight="400"
          bodyWeight="300"
          primaryColor="#f6b8d1"
          headingSize={46}
          bodySize={17}
          headingLetterSpacing={-0.012}
        />
      </div>
    </>
  )
}
