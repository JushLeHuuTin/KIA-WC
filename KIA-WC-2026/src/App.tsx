import { useEffect } from 'react'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Hero from './components/sections/Hero'
import MainFilmCarousel from './components/sections/MainFilmCarousel'
import PhaseOverview from './components/sections/PhaseOverview'
import PhaseDetails from './components/sections/PhaseDetails'
import WatchMoreSection from './components/sections/WatchMoreSection'
import ExperienceCarousel from './components/sections/ExperienceCarousel'
import ConnectStoreSection from './components/sections/ConnectStoreSection'
import OutroSection from './components/sections/OutroSection'
import { useSiteSettings } from './hooks/useSiteSettings'

// Cập nhật <title> và meta description theo SEO mặc định trong Site Settings.
// SPA thuần Vite/React không có SSR nên set thẳng vào DOM thay vì head tĩnh.
function useSeo() {
  const { seoTitle, seoDescription } = useSiteSettings()

  useEffect(() => {
    document.title = seoTitle

    let meta = document.querySelector('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', 'description')
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', seoDescription)
  }, [seoTitle, seoDescription])
}

function App() {
  useSeo()

  return (
    <>
      <Header />
      <main>
        <Hero />
        <MainFilmCarousel />
        <PhaseOverview />
        <PhaseDetails />
        <WatchMoreSection />
        <ExperienceCarousel />
        <ConnectStoreSection />
        <OutroSection />
      </main>
      <Footer />
    </>
  )
}

export default App
