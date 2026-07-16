import { useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperType } from 'swiper'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import { useIsDesktop } from '../../hooks/useMediaQuery'
import YouTubePlayer from '../ui/YouTubePlayer'

// TODO: swap in the client's real YouTube video IDs for each film.
const FILMS = [
  { id: 'the-next-legend', title: 'The Next Legend', videoId: 'F3oRObMMNx8', pc: '/media/cup-main-film/pc-1.jpg', mw: '/media/cup-main-film/mw-1.jpg' },
  { id: 'master-plan', title: 'Master Plan', videoId: 'F3oRObMMNx8', pc: '/media/cup-main-film/pc-2.jpg', mw: '/media/cup-main-film/mw-2.jpg' },
  { id: 'deliver-to-inspire', title: 'Deliver to Inspire', videoId: 'dQw4w9WgXcQ', pc: '/media/cup-main-film/pc-3.jpg', mw: '/media/cup-main-film/mw-3.jpg' },
]

// Swiper's built-in `loop` mode doesn't duplicate slides reliably in this setup
// (verified: it freezes after one transition with only 3 slidesPerView="auto"
// slides), so the infinite loop is faked: repeat the films 3x and silently
// re-center the track once we drift into the first/last copy.
const REPEAT_COUNT = 3
const LOOPED_FILMS = Array.from({ length: REPEAT_COUNT }, (_, copy) =>
  FILMS.map((film) => ({ ...film, key: `${film.id}-${copy}` })),
).flat()

const TRANSITION_SPEED = 800

export default function MainFilmCarousel() {
  const isDesktop = useIsDesktop()
  const swiperRef = useRef<SwiperType | null>(null)
  const recenterTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [slideIndex, setSlideIndex] = useState(FILMS.length + 1)
  // While true, every slide's scale/opacity/blur transition is switched off so the
  // silent re-center jump (see onSlideChange below) can swap which DOM copy is
  // "active" without the two copies visibly un-scaling/re-scaling into place --
  // they sit at the exact same screen position, so the swap must be instant.
  const [noTransition, setNoTransition] = useState(false)
  const activeFilmIndex = slideIndex % FILMS.length

  return (
    <section className="group/carousel relative overflow-hidden bg-black py-14 lg:py-24">
      <Swiper
        modules={[Navigation]}
        centeredSlides
        speed={TRANSITION_SPEED}
        initialSlide={FILMS.length + 1}
        slidesPerView="auto"
        spaceBetween={isDesktop ? 16 : 8}
        onSwiper={(s) => {
          swiperRef.current = s
        }}
        onSlideChange={(s) => {
          setSlideIndex(s.activeIndex)
          // Let the visible slide-to-center animation finish first; only once it
          // has fully settled do we silently snap back to the middle copy of the
          // looped array. Doing this immediately (before the animation plays)
          // was cancelling the slide motion outright, producing an instant,
          // un-animated jump that read as a "buggy" scale/position pop.
          // Clicking twice before the first correction fires used to leave two
          // of these checks stacked up -- the earlier (stale) one would fire
          // mid-way through the second click's animation and cut it short. Only
          // the most recently scheduled check should ever be allowed to run.
          if (recenterTimeout.current) clearTimeout(recenterTimeout.current)
          recenterTimeout.current = setTimeout(() => {
            const target =
              s.activeIndex < FILMS.length
                ? s.activeIndex + FILMS.length
                : s.activeIndex >= FILMS.length * 2
                  ? s.activeIndex - FILMS.length
                  : null
            if (target === null) return
            setNoTransition(true)
            s.slideTo(target, 0)
            requestAnimationFrame(() => requestAnimationFrame(() => setNoTransition(false)))
          }, TRANSITION_SPEED)
        }}
      >
        {LOOPED_FILMS.map((film, index) => {
          const isActive = index === slideIndex
          return (
            // Fixed slide box for every slide (active and peeking alike) so Swiper
            // only ever animates translateX -- a clean, smooth slide-to-center
            // motion. The "active is bigger" look comes purely from a CSS scale
            // transform, which doesn't affect Swiper's slide-position math at all.
            <SwiperSlide
              key={film.key}
              className="!h-auto !w-[min(300px,78vw)] !aspect-[300/400] lg:!w-[min(1318px,68vw)] lg:!aspect-[1318/642]"
            >
              <div
                className={`size-full origin-center ${noTransition ? '' : 'transition-transform duration-700 ease-out'} ${
                  isActive ? 'z-10 scale-100' : 'scale-[0.85] lg:scale-[0.86]'
                }`}
              >
                <div className="relative size-full overflow-hidden rounded-xl">
                  <YouTubePlayer
                    videoId={film.videoId}
                    title={film.title}
                    thumbnail={isDesktop ? film.pc : film.mw}
                    playButtonSize={isDesktop ? 'lg' : 'sm'}
                    showPlayButton={isActive}
                    className={isActive ? '' : 'pointer-events-none'}
                    thumbnailClassName={isActive ? '' : 'scale-110 blur-md'}
                    disableTransition={noTransition}
                  />
                  <div
                    className={`pointer-events-none absolute inset-0 bg-black ${noTransition ? '' : 'transition-opacity duration-700 ease-out'} ${
                      isActive ? 'opacity-0' : 'opacity-50'
                    }`}
                  />
                </div>
              </div>
            </SwiperSlide>
          )
        })}
      </Swiper>

      <button
        type="button"
        aria-label="Previous film"
        onClick={() => swiperRef.current?.slidePrev()}
        className="absolute left-6 top-1/2 z-20 hidden size-[52px] -translate-y-1/2 items-center justify-center rounded-full border border-[#303e48] bg-[rgba(11,13,14,0.48)] opacity-0 shadow-lg transition-opacity group-hover/carousel:opacity-100 lg:left-20 lg:flex"
      >
        <img src="/icons/ic-arrow-back.svg" alt="" className="size-6" />
      </button>
      <button
        type="button"
        aria-label="Next film"
        onClick={() => swiperRef.current?.slideNext()}
        className="absolute right-6 top-1/2 z-20 hidden size-[52px] -translate-y-1/2 items-center justify-center rounded-full border border-[#303e48] bg-[rgba(11,13,14,0.48)] opacity-0 shadow-lg transition-opacity group-hover/carousel:opacity-100 lg:right-20 lg:flex"
      >
        <img src="/icons/ic-arrow-forward.svg" alt="" className="size-6" />
      </button>

      <div className="mt-8 flex flex-col items-center gap-4 lg:mt-10">
        <div className="hidden items-center gap-4 lg:flex">
          {FILMS.map((film, i) => (
            <div key={film.id} className="flex items-center gap-4">
              {i > 0 && <span className="size-[3px] rounded-full bg-white/40" />}
              <span
                className={`text-[18px] leading-[30px] transition-colors duration-500 ${i === activeFilmIndex ? 'text-white' : 'text-[#4a565e]'}`}
              >
                {film.title}
              </span>
            </div>
          ))}
        </div>

        <p className="text-[14px] leading-6 text-white lg:hidden">{FILMS[activeFilmIndex].title}</p>

        <div className="flex items-center gap-1.5 lg:hidden">
          {FILMS.map((film, i) => (
            <span
              key={film.id}
              className={`rounded-full transition-all duration-500 ${
                i === activeFilmIndex ? 'size-1.5 bg-white' : 'size-1 bg-[#4a565e]'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
