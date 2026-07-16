import Header from './components/layout/Header'
import Hero from './components/sections/Hero'
import MainFilmCarousel from './components/sections/MainFilmCarousel'
import PhaseOverview from './components/sections/PhaseOverview'
import PhaseDetails from './components/sections/PhaseDetails'
import WatchMoreSection from './components/sections/WatchMoreSection'
import ExperienceCarousel from './components/sections/ExperienceCarousel'
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
        <section className="flex h-screen items-center justify-center bg-neutral-900 text-white">
          Next section coming soon
        </section>
      </main>
    </>
  )
}

export default App
