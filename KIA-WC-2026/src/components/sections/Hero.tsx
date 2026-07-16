import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useMotionValueEvent, useScroll } from 'motion/react'
import { useIsDesktop } from '../../hooks/useMediaQuery'
import { remap } from '../../lib/scroll'

const INTRO_PARAGRAPH = [
  'As the world watches, the FIFA World Cup™ begins with OMBC.',
  'The Official Match Ball Carrier (OMBC) is a program operated exclusively by Kia,',
  'inviting children onto the pitch to deliver the official match ball to the referee — formally signaling',
  'the start of the match. Each child is personally selected and invited by Kia — future stars of the game.',
  " In that defining moment, they step into the very heart of the world's biggest stage.",
]

export default function Hero() {
  const isDesktop = useIsDesktop()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end end'],
  })

  const kvOpacity = useMotionValue(1)
  const kvY = useMotionValue(0)
  const introOpacity = useMotionValue(0)
  const introY = useMotionValue(40)
  const logoOpacity = useMotionValue(0)
  const dimOpacity = useMotionValue(0.2)
  const videoFilter = useMotionValue('blur(0px)')

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    kvOpacity.set(remap(v, 0.15, 0.28, 1, 0))
    kvY.set(remap(v, 0, 0.28, 0, -40))

    introOpacity.set(
      v < 0.5 ? remap(v, 0.25, 0.4, 0, 1) : remap(v, 0.62, 0.75, 1, 0),
    )
    introY.set(remap(v, 0.25, 0.4, 40, 0))

    logoOpacity.set(remap(v, 0.72, 0.88, 0, 1))

    dimOpacity.set(remap(v, 0, 0.3, 0.2, 0.5))
    videoFilter.set(`blur(${remap(v, 0, 0.3, 0, 14)}px)`)

    const video = videoRef.current
    if (!video) return
    if (v > 0.04 && !video.paused) video.pause()
    if (v <= 0.04 && video.paused) video.play().catch(() => {})
  })

  useEffect(() => {
    videoRef.current?.play().catch(() => {})
  }, [])

  return (
    <div ref={wrapperRef} className="relative h-[300vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        <motion.video
          ref={videoRef}
          className="absolute inset-0 size-full object-cover"
          style={{ filter: videoFilter }}
          src={isDesktop ? '/media/kv/pc.mp4' : '/media/kv/mw.mp4'}
          poster={isDesktop ? '/media/kv/pc-poster.png' : '/media/kv/mw-poster.png'}
          muted
          playsInline
          loop
        />
        <motion.div className="absolute inset-0 bg-black" style={{ opacity: dimOpacity }} />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[150px] bg-gradient-to-t from-black/80 to-transparent" />

        <motion.div
          style={{ opacity: kvOpacity, y: kvY }}
          className="absolute left-6 top-[120px] flex w-[calc(100%-48px)] flex-col items-start gap-4 lg:left-[240px] lg:top-[172px] lg:w-[952px]"
        >
          <p className="pl-1 text-[18px] leading-[30px] text-white">FIFA Official Match Ball Carrier</p>
          <div className="flex w-full flex-col items-start gap-2">
            <h1 className="text-[32px] font-bold leading-[40px] text-white lg:w-[1046px] lg:text-[48px] lg:leading-[62px]">
              Where Young Dreams Move Forward
            </h1>
            <p className="pl-1 text-[16px] leading-[26px] text-white lg:w-[704px] lg:text-[18px] lg:leading-[30px]">
              The 49th Team Creating the Opening Moment of the FIFA World Cup 2026™
            </p>
          </div>
        </motion.div>

        <motion.div
          style={{ opacity: introOpacity, y: introY }}
          className="absolute left-1/2 top-1/2 flex w-[calc(100%-48px)] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-4 text-center lg:w-[708px]"
        >
          <p className="text-[16px] font-bold leading-[26px] text-white lg:text-[18px] lg:leading-[30px]">
            Kia creates the very first moment of the FIFA World Cup™.
          </p>
          <div className="flex flex-col gap-1">
            {INTRO_PARAGRAPH.map((line) => (
              <p key={line} className="text-[14px] leading-[24px] text-white lg:text-[18px] lg:leading-[30px]">
                {line}
              </p>
            ))}
          </div>
        </motion.div>

        <motion.div
          style={{ opacity: logoOpacity }}
          className="absolute left-1/2 top-1/2 w-[280px] -translate-x-1/2 -translate-y-1/2 lg:w-[933px]"
        >
          <img src="/icons/49th-team-logo.png" alt="49th Team presented by Kia" className="w-full" />
        </motion.div>
      </div>
    </div>
  )
}
