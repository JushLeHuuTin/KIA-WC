import { useRef } from 'react'
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
} from 'motion/react'
import { useIsDesktop } from '../../hooks/useMediaQuery'
import { remap } from '../../lib/scroll'

const BODY =
  'The journey of the 49th Team does not end with the opening of the match. As an official partner of the FIFA World Cup 2026™, Kia continues to create more unforgettable moments of the tournament — beginning with OMBC.'

const BUTTON_TITLE = 'Watch more OMBC videos'

const BUTTON_SUBTITLE =
  'Discover the many stories of the 49th Team — united by passion for football and shared dreams.'

function ArrowIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M7 17L17 7M17 7H9M17 7V15"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Content() {
  return (
    <div className="max-w-[430px]">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-[32px] font-medium leading-[42px] text-white lg:text-[48px] lg:leading-[60px]"
      >
        FIFA World Cup 2026™ —
        <br />
        Together with OMBC
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.5,
          delay: 0.2,
        }}
        className="mt-6 text-[14px] leading-7 text-white/70 lg:text-[16px]"
      >
        {BODY}
      </motion.p>

      <motion.a
        href="/videos"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.5,
          delay: 0.4,
        }}
        className="mt-8 inline-flex items-center gap-3 border border-white/25 bg-black/20 px-5 py-4 text-white backdrop-blur-sm transition hover:bg-black/35"
      >
        <div>
          <p className="text-[15px] font-medium">{BUTTON_TITLE}</p>
          <p className="mt-1 text-[12px] text-white/60">
            {BUTTON_SUBTITLE}
          </p>
        </div>

        <ArrowIcon />
      </motion.a>
    </div>
  )
}

function DesktopVersion() {
  return (
    <section className="relative flex h-screen items-center overflow-hidden">
      <img
        src="/media/playlist/pc.jpg"
        alt=""
        className="absolute inset-0 size-full object-cover"
      />

     <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-transparent to-black/100" />
      <div className="relative z-10 mx-auto flex w-full max-w-[1280px] justify-end px-6 lg:px-10">
        <Content />
      </div>
    </section>
  )
}

function MobileVersion() {
  const wrapperRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end end'],
  })

  const dimOpacity = useMotionValue(0)

  const titleOpacity = useMotionValue(0)
  const subtitleOpacity = useMotionValue(0)
  const buttonOpacity = useMotionValue(0)

  const titleY = useMotionValue(24)
  const subtitleY = useMotionValue(24)
  const buttonY = useMotionValue(24)

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    dimOpacity.set(remap(v, 0.2, 0.6, 0, 0.65))

    titleOpacity.set(remap(v, 0.45, 0.58, 0, 1))
    subtitleOpacity.set(remap(v, 0.56, 0.7, 0, 1))
    buttonOpacity.set(remap(v, 0.68, 0.82, 0, 1))

    titleY.set(remap(v, 0.45, 0.58, 24, 0))
    subtitleY.set(remap(v, 0.56, 0.7, 24, 0))
    buttonY.set(remap(v, 0.68, 0.82, 24, 0))
  })

  return (
    <div
      ref={wrapperRef}
      className="relative h-[220vh]"
    >
      <div className="sticky top-0 flex h-screen items-end overflow-hidden pb-16">
        <img
          src="/media/playlist/mw.jpg"
          alt=""
          className="absolute inset-0 size-full object-cover"
        />

        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"
          style={{ opacity: dimOpacity }}
        />

        <div className="relative z-10 w-full px-6 max-w-[430px]">

          <motion.h2
            style={{
              opacity: titleOpacity,
              y: titleY,
            }}
            className="text-[32px] font-medium leading-[42px] text-white"
          >
            FIFA World Cup 2026™ —
            <br />
            Together with OMBC
          </motion.h2>

          <motion.p
            style={{
              opacity: subtitleOpacity,
              y: subtitleY,
            }}
            className="mt-6 text-[14px] leading-7 text-white/70"
          >
            {BODY}
          </motion.p>

          <motion.a
            href="/videos"
            style={{
              opacity: buttonOpacity,
              y: buttonY,
            }}
            className="mt-8 inline-flex items-center gap-3 border border-white/25 bg-black/20 px-5 py-4 text-white backdrop-blur-sm"
          >
            <div>
              <p className="text-[15px] font-medium">
                {BUTTON_TITLE}
              </p>

              <p className="mt-1 text-[12px] text-white/60">
                {BUTTON_SUBTITLE}
              </p>
            </div>

            <ArrowIcon />
          </motion.a>

        </div>
      </div>
    </div>
  )
}

export default function WatchMoreSection() {
  const isDesktop = useIsDesktop()

  return isDesktop ? <DesktopVersion /> : <MobileVersion />
}