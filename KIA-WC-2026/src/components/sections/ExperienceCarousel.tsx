import { useRef, useState, type PointerEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useIsDesktop } from '../../hooks/useMediaQuery'
import { useSanityData } from '../../hooks/useSanityData'
import { EXPERIENCE_CAROUSEL_QUERY } from '../../lib/queries'

// Nội dung mặc định -- dùng khi Sanity chưa có document `experienceCarousel`
// hoặc field nào chưa được nhập (xem quy ước fallback trong CLAUDE.md). Copy
// lấy đúng theo Figma (khách hàng cung cấp trực tiếp qua ảnh chụp màn hình),
// không tự diễn giải/paraphrase.
const FALLBACK_HEADING = 'Experience Beyond the Match'
const FALLBACK_BODY =
  'The excitement that begins inside the stadium extends far beyond it. As an official partner of the FIFA World Cup 2026™, Kia expands the tournament experience — from mobility to shared experiences and connection.'
const FALLBACK_EXPERIENCES = [
  {
    _key: 'vehicle-support',
    title: 'Official Tournament Vehicle Support',
    description:
      'Kia has long supported the mobility of players and officials across FIFA international tournaments, ensuring that every moment flows seamlessly.',
    pcImageUrl: '/media/experience/pc-1.jpg',
    thumbImageUrl: '/media/experience/pc-1-thumb.jpg',
    mwImageUrl: '/media/experience/mw-1.jpg',
  },
  {
    _key: 'youth-programs',
    title: 'Youth and Future Generation Programs',
    description:
      "From youth and grassroots fan moments to futsal and the FIFA eWorld Cup™, Kia continues to support football's future — staying closer to the next generation of fans and dreams.",
    pcImageUrl: '/media/experience/pc-2.jpg',
    thumbImageUrl: '/media/experience/pc-2-thumb.jpg',
    mwImageUrl: '/media/experience/mw-2.jpg',
  },
  {
    _key: 'fan-festival',
    title: 'FIFA Fan Festival',
    description:
      'A global gathering place beyond the stadium, where fans connect with the passion of football with culture and celebration through mobility experience.',
    pcImageUrl: '/media/experience/pc-3.jpg',
    thumbImageUrl: '/media/experience/pc-3-thumb.jpg',
    mwImageUrl: '/media/experience/mw-3.jpg',
  },
  {
    _key: 'brand-booth',
    title: 'Brand Booth',
    description:
      'A space to experience the present and future of mobility. Through its EV lineup, Kia strives for electrification and sustainability.',
    pcImageUrl: '/media/experience/pc-4.jpg',
    thumbImageUrl: '/media/experience/pc-4-thumb.jpg',
    mwImageUrl: '/media/experience/mw-4.jpg',
  },
]

interface ExperienceCarouselData {
  heading: string | null
  body: string | null
  experiences:
    | {
        _key: string
        title: string
        description: string | null
        pcImageUrl: string | null
        thumbImageUrl: string | null
        mwImageUrl: string | null
      }[]
    | null
}

function useExperienceContent() {
  const { data } = useSanityData<ExperienceCarouselData>(EXPERIENCE_CAROUSEL_QUERY)
  return {
    heading: data?.heading ?? FALLBACK_HEADING,
    body: data?.body ?? FALLBACK_BODY,
    experiences: data?.experiences?.length ? data.experiences : FALLBACK_EXPERIENCES,
  }
}

// Kéo trái/phải để chuyển slide (đúng rule PDF mục 9). Dùng Pointer Events thủ công
// thay vì `drag` prop của Motion -- tránh lặp lại các bug đã gặp với thư viện này
// trong dự án (xem MainFilmCarousel.tsx, PhaseDetails.tsx). Không cần theo dõi vị trí
// theo thời gian thực khi kéo, chỉ cần phát hiện hướng vuốt lúc thả tay.
const SWIPE_THRESHOLD = 40

function useSwipe(onSwipe: (direction: 1 | -1) => void) {
  const startX = useRef<number | null>(null)

  return {
    onPointerDown: (e: PointerEvent) => {
      startX.current = e.clientX
    },
    onPointerUp: (e: PointerEvent) => {
      if (startX.current === null) return
      const deltaX = e.clientX - startX.current
      startX.current = null
      if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
        onSwipe(deltaX < 0 ? 1 : -1)
      }
    },
    onPointerLeave: () => {
      startX.current = null
    },
  }
}

function DesktopVersion() {
  const { heading, body, experiences } = useExperienceContent()
  const [activeIndex, setActiveIndex] = useState(0)
  const active = experiences[activeIndex]

  const goto = (delta: number) => {
    setActiveIndex((prev) => (prev + delta + experiences.length) % experiences.length)
  }
  const swipeHandlers = useSwipe(goto)

  // Thứ tự thumbnail luôn là các item còn lại, bắt đầu ngay sau item đang active
  // (khớp đúng hành vi xoay vòng thấy trong thiết kế Figma).
  const thumbnails = experiences
    .map((item, i) => ({ item, i }))
    .filter(({ i }) => i !== activeIndex)
    .sort((a, b) => ((a.i - activeIndex + experiences.length) % experiences.length) - ((b.i - activeIndex + experiences.length) % experiences.length))

  return (
    <section className="group/exp bg-black px-2 py-6 lg:px-5 lg:py-10">
      <div className="relative rounded-2xl bg-[#e8eaeb] px-6 pb-10 pt-12 lg:px-20 lg:pb-16 lg:pt-[60px]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="grid gap-4 lg:grid-cols-2 lg:gap-10"
        >
          <h2 className="text-[24px] leading-9 text-[#05141f] lg:text-[36px] lg:leading-[54px]">
            {heading}
          </h2>

          <p className="text-[14px] leading-6 text-[#303e48] lg:text-[16px] lg:leading-7">
            {body}
          </p>
        </motion.div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:mt-12 lg:grid-cols-2">
          <div
            {...swipeHandlers}
            role="img"
            aria-label={active.title}
            className="relative aspect-[4/3] w-full touch-pan-y select-none overflow-hidden rounded-xl lg:aspect-auto lg:h-[420px]"
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={activeIndex}
                src={active.pcImageUrl ?? undefined}
                alt={active.title}
                draggable={false}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="absolute inset-0 size-full object-cover"
              />
            </AnimatePresence>
          </div>

          <div className="flex flex-col gap-6 justify-between">
            <div className="grid grid-cols-3 gap-3">
              {/* 3 khung cố định theo vị trí (key = slot, không đổi) -- chỉ nội dung
                  ảnh bên trong crossfade khi đổi active, tránh unmount/mount đột ngột
                  và tránh dùng `layout` prop (đã gây lỗi mờ ảnh ở PhaseDetails). */}
              {thumbnails.map(({ item, i }, slot) => (
                <div key={slot} className="relative aspect-square overflow-hidden rounded-lg">
                  <AnimatePresence mode="wait">
                    <motion.button
                      key={item._key}
                      type="button"
                      onClick={() => setActiveIndex(i)}
                      aria-label={`Show ${item.title}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="absolute inset-0"
                    >
                      <img src={item.thumbImageUrl ?? undefined} alt={item.title} className="size-full object-cover" />
                    </motion.button>
                  </AnimatePresence>
                </div>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="flex flex-col gap-2"
              >
                <p className="text-[18px] leading-[30px] text-[#05141f]">{active.title}</p>
                <p className="text-[14px] leading-6 text-[#303e48]">{active.description}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-1.5 lg:mt-10">
          {experiences.map((item, i) => (
            <button
              key={item._key}
              type="button"
              aria-label={`Go to ${item.title}`}
              onClick={() => setActiveIndex(i)}
              className={`rounded-full transition-all duration-300 ${i === activeIndex ? 'size-1.5 bg-[#05141f]' : 'size-1 bg-[#4a565e]/40'
                }`}
            />
          ))}
        </div>

        <button
          type="button"
          aria-label="Previous"
          onClick={() => goto(-1)}
          className="absolute left-2 top-1/2 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white opacity-0 shadow-lg transition-opacity duration-300 group-hover/exp:opacity-100 lg:flex"
        >
          <img src="/icons/ic-arrow-back.svg" alt="" className="size-5 invert" />
        </button>
        <button
          type="button"
          aria-label="Next"
          onClick={() => goto(1)}
          className="absolute right-2 top-1/2 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white opacity-0 shadow-lg transition-opacity duration-300 group-hover/exp:opacity-100 lg:flex"
        >
          <img src="/icons/ic-arrow-forward.svg" alt="" className="size-5 invert" />
        </button>
      </div>
    </section>
  )
}

const MOBILE_TRANSITION_MS = 500

function MobileVersion() {
  const { heading, body, experiences } = useExperienceContent()
  const [slideIndex, setSlideIndex] = useState(experiences.length)
  const [noTransition, setNoTransition] = useState(false)
  const recenterTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const activeIndex = ((slideIndex % experiences.length) + experiences.length) % experiences.length
  const active = experiences[activeIndex]
  const swipeHandlers = useSwipe((direction) => goto(direction))

  // Loop thủ công (nhân 3 bản dữ liệu) -- tránh dùng Swiper `loop` cho carousel
  // mobile, vì loop gốc của Swiper đã xác nhận không đáng tin cậy trong dự án
  // này (xem ghi chú tương tự trong MainFilmCarousel.tsx).
  const LOOPED = Array.from({ length: 3 }, (_, copy) =>
    experiences.map((item) => ({ ...item, key: `${item._key}-${copy}` })),
  ).flat()

  // Cùng kỹ thuật loop thủ công như MainFilmCarousel: sau khi trượt xong, nếu đã
  // trôi ra khỏi 1/3 giữa của mảng lặp, âm thầm nhảy về vị trí tương đương ở giữa
  // (tắt transition đúng lúc nhảy để không bị giật).
  const goto = (delta: number) => {
    setSlideIndex((prev) => {
      const next = prev + delta
      if (recenterTimeout.current) clearTimeout(recenterTimeout.current)
      recenterTimeout.current = setTimeout(() => {
        const target =
          next < experiences.length
            ? next + experiences.length
            : next >= experiences.length * 2
              ? next - experiences.length
              : null
        if (target === null) return
        setNoTransition(true)
        setSlideIndex(target)
        requestAnimationFrame(() => requestAnimationFrame(() => setNoTransition(false)))
      }, MOBILE_TRANSITION_MS)
      return next
    })
  }

  return (
    <section className="bg-black px-2 py-6">
      <div className="rounded-2xl bg-[#e8eaeb] px-6 pb-10 pt-10">
        <h2 className="text-[24px] leading-9 text-[#05141f]">{heading}</h2>
        <p className="mt-4 text-[14px] leading-6 text-[#303e48]">{body}</p>

        <div className="relative mt-8 overflow-hidden rounded-xl">
          <div
            {...swipeHandlers}
            className={`flex touch-pan-y select-none ${noTransition ? '' : 'transition-transform duration-500 ease-out'}`}
            style={{ transform: `translateX(-${slideIndex * 100}%)` }}
          >
            {LOOPED.map((item) => (
              <img
                key={item.key}
                src={item.mwImageUrl ?? undefined}
                alt={item.title}
                draggable={false}
                className="aspect-square w-full shrink-0 object-cover"
              />
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <p className="text-[16px] leading-7 text-[#05141f]">{active.title}</p>
          <p className="text-[13px] leading-6 text-[#303e48]">{active.description}</p>
        </div>

        {/* Mobile chỉ điều hướng bằng vuốt trái/phải + dots -- không có nút mũi tên
            (khác desktop, nơi nút chỉ hiện khi hover, vốn không áp dụng cho mobile). */}
        <div className="mt-6 flex items-center justify-center gap-1.5">
          {experiences.map((item, i) => (
            <span
              key={item._key}
              className={`rounded-full transition-all duration-300 ${i === activeIndex ? 'size-1.5 bg-[#05141f]' : 'size-1 bg-[#4a565e]/40'
                }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default function ExperienceCarousel() {
  const isDesktop = useIsDesktop()
  return isDesktop ? <DesktopVersion /> : <MobileVersion />
}
