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
function App() {
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
