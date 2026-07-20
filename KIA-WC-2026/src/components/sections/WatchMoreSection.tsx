import { useRef } from 'react'
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
} from 'motion/react'
import { useIsDesktop } from '../../hooks/useMediaQuery'
import { usePayloadData } from '../../hooks/usePayloadData'
import { normalizeWatchMore, type PayloadWatchMore } from '../../lib/normalize'
import { remap } from '../../lib/scroll'

// Nội dung mặc định -- dùng khi Sanity chưa có document `watchMore` hoặc field
// nào chưa được nhập (xem quy ước fallback trong CLAUDE.md).
const FALLBACK = {
  heading: 'FIFA World Cup 2026™ —\nTogether with OMBC',
  body: 'The journey of the 49th Team does not end with the opening of the match. As an official partner of the FIFA World Cup 2026™, Kia continues to create more unforgettable moments of the tournament — beginning with OMBC.',
  buttonTitle: 'Watch more OMBC videos',
  buttonSubtitle: 'Discover the many stories of the 49th Team — united by passion for football and shared dreams.',
  buttonHref: '/videos',
  pcImageUrl: '/media/playlist/pc.jpg',
  mwImageUrl: '/media/playlist/mw.jpg',
}

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

// Heading cho phép xuống dòng thủ công trong Sanity (field type "text") --
// tách theo "\n" và render từng dòng cách nhau bằng <br/>.
function Heading({ text, className }: { text: string; className: string }) {
  const lines = text.split('\n')
  return (
    <>
      {lines.map((line, i) => (
        <span key={line} className={className}>
          {line}
          {i < lines.length - 1 && <br />}
        </span>
      ))}
    </>
  )
}

function Content({ data }: { data: ReturnType<typeof useWatchMoreContent> }) {
  return (
    <div className="max-w-[430px]">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-[32px] font-medium leading-[42px] text-white lg:text-[48px] lg:leading-[60px]"
      >
        <Heading text={data.heading} className="" />
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
        {data.body}
      </motion.p>

      <motion.a
        href={data.buttonHref}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.5,
          delay: 0.4,
        }}
        className="mt-8 inline-flex items-center gap-3 rounded-[8px] border border-white/25 bg-black/20 px-5 py-4 text-white backdrop-blur-sm transition hover:bg-black/35"
      >
        <div>
          <p className="text-[15px] font-medium">{data.buttonTitle}</p>
          <p className="mt-1 text-[12px] text-white/60">
            {data.buttonSubtitle}
          </p>
        </div>

        <ArrowIcon />
      </motion.a>
    </div>
  )
}

function useWatchMoreContent() {
  const { data: rawData } = usePayloadData<PayloadWatchMore>('watch-more')
  const data = normalizeWatchMore(rawData)
  return {
    heading: data?.heading ?? FALLBACK.heading,
    body: data?.body ?? FALLBACK.body,
    buttonTitle: data?.buttonTitle ?? FALLBACK.buttonTitle,
    buttonSubtitle: data?.buttonSubtitle ?? FALLBACK.buttonSubtitle,
    buttonHref: data?.buttonHref ?? FALLBACK.buttonHref,
    pcImageUrl: data?.pcImageUrl ?? FALLBACK.pcImageUrl,
    mwImageUrl: data?.mwImageUrl ?? FALLBACK.mwImageUrl,
  }
}

function DesktopVersion() {
  const content = useWatchMoreContent()
  return (
    <section className="relative flex h-screen items-center overflow-hidden">
      <img
        src={content.pcImageUrl}
        alt=""
        className="absolute inset-0 size-full object-cover"
      />

     <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-transparent to-black/100" />
      <div className="relative z-10 mx-auto flex w-full max-w-[1280px] justify-end px-6 lg:px-10">
        <Content data={content} />
      </div>
    </section>
  )
}

function MobileVersion() {
  const content = useWatchMoreContent()
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
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <img
          src={content.mwImageUrl}
          alt=""
          className="absolute inset-0 size-full object-cover"
        />

        <motion.div
          className="absolute inset-0 bg-black"
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
            <Heading text={content.heading} className="" />
          </motion.h2>

          <motion.p
            style={{
              opacity: subtitleOpacity,
              y: subtitleY,
            }}
            className="mt-6 text-[14px] leading-7 text-white/70"
          >
            {content.body}
          </motion.p>

          <motion.a
            href={content.buttonHref}
            style={{
              opacity: buttonOpacity,
              y: buttonY,
            }}
            className="mt-8 inline-flex items-center gap-3 rounded-[8px] border border-white/25 bg-black/20 px-5 py-4 text-white backdrop-blur-sm"
          >
            <div>
              <p className="text-[15px] font-medium">
                {content.buttonTitle}
              </p>

              <p className="mt-1 text-[12px] text-white/60">
                {content.buttonSubtitle}
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
