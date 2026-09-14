import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { KageLandingPage } from '@designcodeio/threeui'
import '@designcodeio/threeui/style.css'

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
  )
}
