import { motion } from 'motion/react'
import { useIsDesktop } from '../../hooks/useMediaQuery'
import { usePayloadData } from '../../hooks/usePayloadData'
import { normalizeOutro, type PayloadOutro } from '../../lib/normalize'

// Nội dung mặc định -- dùng khi Sanity chưa có document `outro` hoặc field nào
// chưa được nhập (xem quy ước fallback trong CLAUDE.md). Copy lấy đúng theo
// file "00_Section Name.png" của khách hàng (mục "11. Outro").
const FALLBACK_PARAGRAPHS = [
  {
    _key: '1',
    bold: false,
    text: 'OMBC has long invited children to take part in the opening moment of the FIFA World Cup™. The OMBC Cup transforms their own challenge into an experience of growth.',
  },
  {
    _key: '2',
    bold: false,
    text: 'And at the moment they deliver the official match ball, the match officially begins.',
  },
  {
    _key: '3',
    bold: true,
    text: "Kia continues the journey with them at the FIFA World Cup 2026™, ensuring their beginning becomes part of the FIFA World Cup™'s memory.",
  },
]
const FALLBACK_PC_IMAGE = '/media/outro/pc.jpg'
const FALLBACK_MW_IMAGE = '/media/outro/mw.jpg'

export default function OutroSection() {
  const isDesktop = useIsDesktop()
  const { data: rawData } = usePayloadData<PayloadOutro>('outro')
  const data = normalizeOutro(rawData)
  const paragraphs = data?.paragraphs?.length ? data.paragraphs : FALLBACK_PARAGRAPHS
  const image = (isDesktop ? data?.pcImageUrl : data?.mwImageUrl) ?? (isDesktop ? FALLBACK_PC_IMAGE : FALLBACK_MW_IMAGE)

  return (

    <section className="relative z-40 -top-40 flex items-center overflow-hidden bg-black">
      {/* Gradient phía trên */}
      <div className="absolute top-0 left-0 z-10 h-140 w-full bg-gradient-to-b from-black to-transparent" />

      {/* Gradient phía dưới */}
      <div className="absolute bottom-0 left-0 z-10 h-40 w-full bg-gradient-to-t from-black to-transparent" />
      <div className="relative w-full overflow-hidden rounded-2xl">
        <img
          src={image}
          alt=""
          className="h-[85vh] w-full object-cover lg:h-[900px]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        <div className="absolute left-6 lg-top-20 top-50 flex w-[calc(100%-48px)] flex-col gap-5 lg:left-20 lg:top-1/2 lg:w-[500px] lg:-translate-y-1/2">
          {/* Copy xuất hiện tuần tự từng đoạn, fade-in (đúng rule PDF mục 11). */}
          {paragraphs.map((p, i) => (
            <motion.p
              key={p._key}
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
