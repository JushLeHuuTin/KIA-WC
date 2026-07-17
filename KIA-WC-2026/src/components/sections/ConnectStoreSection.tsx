import { motion } from 'motion/react'
import { useIsDesktop } from '../../hooks/useMediaQuery'

// Copy lấy đúng theo file "00_Section Name.png" của khách hàng (mục "10. Connect Store").
const BODY =
  "Every moment of the FIFA World Cup 2026™, Kia stands alongside the passion and determination of the OMBCs. Experience the excitement of passionate support and thrilling victories through Kia's display theme."

function LearnMoreButton() {
  return (
    <a
      href="/connect-store"
      className="mt-8 self-center rounded inline-flex w-fit items-center gap-2 border border-white/25 px-6 py-3 text-[15px] text-white transition hover:bg-white/10 lg:self-auto"
    >
      Learn more
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path
          d="M7 17L17 7M17 7H9M17 7V15"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  )
}

export default function ConnectStoreSection() {
  const isDesktop = useIsDesktop()

  return (
    <section className=" bg-black px-2 lg:px-5 ">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 w-full bg-gradient-to-t from-[#1e2023] to-transparent" />
      <div className="relative z-100 flex flex-col-reverse gap-8 overflow-hidden rounded-2xl bg-[#1c1f21] px-6 py-10 lg:flex-row lg:items-center lg:gap-10 lg:px-20 lg:py-[60px]">
        {/* Copy trong card fade-in (đúng rule: "the copy within each card fades in"). */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex flex-col items-start lg:w-1/2 "
        >
          <h2 className="text-[24px] leading-9 text-white lg:text-[32px] lg:leading-[42px]">
            FIFA World Cup 2026™
            <br />
            Download the 49th Team Display Theme
          </h2>
          <p className="mt-4 text-[14px] leading-6 text-white/70 lg:text-[16px] lg:leading-7">{BODY}</p>
          <LearnMoreButton />
        </motion.div>

        {/* Ảnh xuất hiện với animation pop-up (đúng rule: "images appear with a pop-up animation"). */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
          className="overflow-hidden rounded-xl lg:w-1/2"
        >
          <img
            src={isDesktop ? '/media/connect-store/pc.jpg' : '/media/connect-store/mw.jpg'}
            alt="49th Team Display Theme"
            className="w-full object-cover"
          />
        </motion.div>

      </div>
    </section>
  )
}
