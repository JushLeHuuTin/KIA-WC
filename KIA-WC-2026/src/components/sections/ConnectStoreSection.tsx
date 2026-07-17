import { motion } from 'motion/react'
import { useIsDesktop } from '../../hooks/useMediaQuery'
import { useSanityData } from '../../hooks/useSanityData'
import { CONNECT_STORE_QUERY } from '../../lib/queries'

// Nội dung mặc định -- dùng khi Sanity chưa có document `connectStore` hoặc
// field nào chưa được nhập (xem quy ước fallback trong CLAUDE.md).
const FALLBACK = {
  heading: 'FIFA World Cup 2026™\nDownload the 49th Team Display Theme',
  body: "Every moment of the FIFA World Cup 2026™, Kia stands alongside the passion and determination of the OMBCs. Experience the excitement of passionate support and thrilling victories through Kia's display theme.",
  buttonTitle: 'Learn more',
  buttonHref: '/connect-store',
  pcImageUrl: '/media/connect-store/pc.jpg',
  mwImageUrl: '/media/connect-store/mw.jpg',
}

interface ConnectStoreData {
  heading: string | null
  body: string | null
  buttonTitle: string | null
  buttonHref: string | null
  pcImageUrl: string | null
  mwImageUrl: string | null
}

// Heading cho phép xuống dòng thủ công trong Sanity (field type "text") --
// tách theo "\n" và render từng dòng cách nhau bằng <br/>.
function Heading({ text }: { text: string }) {
  const lines = text.split('\n')
  return (
    <>
      {lines.map((line, i) => (
        <span key={line}>
          {line}
          {i < lines.length - 1 && <br />}
        </span>
      ))}
    </>
  )
}

function LearnMoreButton({ title, href }: { title: string; href: string }) {
  return (
    <a
      href={href}
      className="mt-8 self-center rounded inline-flex w-fit items-center gap-2 border border-white/25 px-6 py-3 text-[15px] text-white transition hover:bg-white/10 lg:self-auto"
    >
      {title}
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
  const { data } = useSanityData<ConnectStoreData>(CONNECT_STORE_QUERY)
  const heading = data?.heading ?? FALLBACK.heading
  const body = data?.body ?? FALLBACK.body
  const buttonTitle = data?.buttonTitle ?? FALLBACK.buttonTitle
  const buttonHref = data?.buttonHref ?? FALLBACK.buttonHref
  const image = (isDesktop ? data?.pcImageUrl : data?.mwImageUrl) ?? (isDesktop ? FALLBACK.pcImageUrl : FALLBACK.mwImageUrl)

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
            <Heading text={heading} />
          </h2>
          <p className="mt-4 text-[14px] leading-6 text-white/70 lg:text-[16px] lg:leading-7">{body}</p>
          <LearnMoreButton title={buttonTitle} href={buttonHref} />
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
            src={image}
            alt="49th Team Display Theme"
            className="w-full object-cover"
          />
        </motion.div>

      </div>
    </section>
  )
}
