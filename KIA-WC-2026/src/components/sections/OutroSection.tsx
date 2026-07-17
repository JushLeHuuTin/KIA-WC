import { motion } from 'motion/react'
import { useIsDesktop } from '../../hooks/useMediaQuery'

// Copy lấy đúng theo file "00_Section Name.png" của khách hàng (mục "11. Outro").
// Đoạn cuối in đậm (bold) trong thiết kế gốc.
const PARAGRAPHS = [
  {
    bold: false,
    text: 'OMBC has long invited children to take part in the opening moment of the FIFA World Cup™. The OMBC Cup transforms their own challenge into an experience of growth.',
  },
  {
    bold: false,
    text: 'And at the moment they deliver the official match ball, the match officially begins.',
  },
  {
    bold: true,
    text: "Kia continues the journey with them at the FIFA World Cup 2026™, ensuring their beginning becomes part of the FIFA World Cup™'s memory.",
  },
]

export default function OutroSection() {
  const isDesktop = useIsDesktop()

  return (
 <section className="relative z-10 -top-40 flex min-h-screen items-center overflow-hidden bg-black 
  before:absolute before:top-0 before:left-0 before:z-10 before:h-40 before:w-full before:bg-gradient-to-b before:from-black before:to-transparent 
  after:absolute after:bottom-0 after:left-0 after:z-10 after:h-40 after:w-full after:bg-gradient-to-t after:from-black after:to-transparent">
      <div className="relative w-full overflow-hidden rounded-2xl">
        <img
          src={isDesktop ? '/media/outro/pc.jpg' : '/media/outro/mw.jpg'}
          alt=""
          className="h-[85vh] w-full object-cover lg:h-[900px]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        <div className="absolute left-6 top-1/2 flex w-[calc(100%-48px)] -translate-y-1/2 flex-col gap-5 lg:left-20 lg:w-[500px]">
          {/* Copy xuất hiện tuần tự từng đoạn, fade-in (đúng rule PDF mục 11). */}
          {PARAGRAPHS.map((p, i) => (
            <motion.p
              key={p.text}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: i * 0.35 }}
              className={`text-[14px] leading-6 text-white lg:text-[16px] lg:leading-7 ${p.bold ? 'font-semibold' : 'font-normal'}`}
            >
              {p.text}
            </motion.p>
          ))}
        </div>
      </div>
    </section>
  )
}
