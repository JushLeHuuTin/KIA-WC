import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useIsDesktop } from '../../hooks/useMediaQuery'
import { usePayloadData } from '../../hooks/usePayloadData'
import { normalizePhaseDetails, type PayloadPhaseDetails } from '../../lib/normalize'
import YouTubePlayer from '../ui/YouTubePlayer'

// Gradient nền của từng item trong danh sách -- lấy đúng màu từ Figma
// (dùng chung cho mọi item, kể cả item đang active; Figma không tô đậm hay
// viền riêng cho active, chỉ phân biệt bằng việc hiện/ẩn phần mô tả).
const ITEM_GRADIENT =
  'linear-gradient(210deg, rgba(42,47,50,0.64) 4%, rgba(48,62,72,0.64) 39%, rgba(38,45,49,0.64) 105%)'

// Nội dung mặc định -- dùng khi Sanity chưa có document `phaseDetails` hoặc
// field nào chưa được nhập (xem quy ước fallback trong CLAUDE.md).
// TODO: thay videoId placeholder bằng ID YouTube thật khi khách hàng cung cấp.
const FALLBACK_PHASES = [
  {
    _key: 'phase-1',
    anchorId: 'phase-1',
    eyebrow: 'Phase 1: The Calling',
    headline: 'A Call Toward a Dream',
    body: 'French football legend Thierry Henry sets out to build OMBC — the 49th Team of the FIFA World Cup 2026™. Answering his call, football legends from around the world join one by one, as the journey to becoming the 49th Team begins.',
    bgPcUrl: '/media/phase-detail/pc-1-bg.png',
    bgMwUrl: '/media/phase-detail/mw-1-bg.png',
    items: [
      {
        _key: '1-1',
        title: '49th Team Draw',
        description:
          'Through the draw, Thierry Henry unveils the participating countries of the Kia OMBC Cup, alongside the FIFA World Cup 2026™. The ceremony marks the beginning of the 49th Team journey and introduces the nations that will take part in this once-in-a-lifetime experience.',
        videoId: '4jjOH2FR6-E',
        pcImageUrl: '/media/phase-detail/pc-1-item1.jpg',
        mwImageUrl: '/media/phase-detail/mw-1-item1.jpg',
      },
      {
        _key: '1-2',
        title: 'Rio Ferdinand Joins',
        description:
          'Rio Ferdinand answers Thierry Henry’s call, bringing his experience and leadership to inspire the next generation of the 49th Team. He encourages young players to believe in teamwork, confidence, and dedication throughout the journey.',
        videoId: 'aqz-KE-bpKQ',
        pcImageUrl: '/media/phase-detail/pc-1-item2.jpg',
        mwImageUrl: '/media/phase-detail/mw-1-item2.jpg',
      },
      {
        _key: '1-3',
        title: 'Jorge Campos Joins',
        description:
          'Legendary goalkeeper Jorge Campos joins the journey, encouraging young players to embrace confidence, creativity, and courage. His unique personality reminds every participant that football is about joy as much as competition.',
        videoId: '3JZ_D3ELwOQ',
        pcImageUrl: '/media/phase-detail/pc-1-item3.jpg',
        mwImageUrl: '/media/phase-detail/mw-1-item3.jpg',
      },
      {
        _key: '1-4',
        title: 'David Villa Joins',
        description:
          'David Villa becomes part of the 49th Team, sharing his passion for football and inspiring children to dream beyond limits. His story shows that perseverance and hard work can turn dreams into reality.',
        videoId: 'ysz5S6PUM-U',
        pcImageUrl: '/media/phase-detail/pc-1-item4.jpg',
        mwImageUrl: '/media/phase-detail/mw-1-item4.jpg',
      },
      {
        _key: '1-5',
        title: 'Ahn Jung-hwan Joins',
        description:
          'Ahn Jung-hwan completes the lineup of legends, adding his unique story and international experience. Together, the legends prepare the future OMBCs for an unforgettable adventure.',
        videoId: 'M7lc1UVf-VE',
        pcImageUrl: '/media/phase-detail/pc-1-item5.jpg',
        mwImageUrl: '/media/phase-detail/mw-1-item5.jpg',
      },
    ],
  },
  {
    _key: 'phase-2',
    anchorId: 'phase-2',
    eyebrow: 'Phase 2: Local Audition',
    headline: 'Chosen by Legends',
    body: 'Across 10 countries around the world, legends and coaches set out to find the children who would join the OMBC journey. What mattered most went beyond skill. Children who embody five values — Passion, Courage, Resilience, Joy, and Inspiration — are chosen as the new faces of the 49th Team.',
    bgPcUrl: '/media/phase-detail/pc-2-bg.png',
    bgMwUrl: '/media/phase-detail/mw-2-bg.png',
    items: [
      {
        _key: '2-1',
        title: 'Manifesto',
        description:
          'Thierry Henry, leader of the 49th Team, introduces the Official Match Ball Carriers — the 49th to join the FIFA World Cup™ — and shares their stories with the world. Witness their journey to becoming OMBCs.',
        videoId: '',
        pcImageUrl: '/media/phase-detail/pc-2-item1.jpg',
        mwImageUrl: '/media/phase-detail/mw-2-item1.jpg',
      },
      {
        _key: '2-2',
        title: 'The Call Up',
        description:
          'Young football fans from around the world answer the call, taking their first step toward becoming members of the 49th Team.',
        videoId: '',
        pcImageUrl: '/media/phase-detail/pc-2-item2.jpg',
        mwImageUrl: '/media/phase-detail/mw-2-item2.jpg',
      },
      {
        _key: '2-3',
        title: 'The Selection',
        description:
          'Legends and coaches carefully select children who demonstrate not only football talent but also the five core values of the program.',
        videoId: '',
        pcImageUrl: '/media/phase-detail/pc-2-item3.jpg',
        mwImageUrl: '/media/phase-detail/mw-2-item3.jpg',
      },
      {
        _key: '2-4',
        title: 'Ways of the Team',
        description:
          'The selected children learn the mindset, values, and spirit that define the 49th Team before taking the next step together.',
        videoId: '',
        pcImageUrl: '/media/phase-detail/pc-2-item4.jpg',
        mwImageUrl: '/media/phase-detail/mw-2-item4.jpg',
      },
      {
        _key: '2-5',
        title: 'Squad Reveal',
        description:
          'The final squad of Official Match Ball Carriers is revealed, introducing the young players who will represent the 49th Team.',
        videoId: '',
        pcImageUrl: '/media/phase-detail/pc-2-item5.jpg',
        mwImageUrl: '/media/phase-detail/mw-2-item5.jpg',
      },
    ],
  },
  {
    _key: 'phase-3',
    anchorId: 'phase-3',
    eyebrow: 'Phase 3: Kia OMBC Cup 2026™',
    headline: 'Becoming One Team',
    body: 'For the first time, the OMBCs selected from each country come together in Los Angeles. The Kia OMBC Cup 2026™ is more than just a tournament. Under the guidance of legends, the children move beyond competition to understand one another and grow together — becoming the true 49th Team, ready to step onto the FIFA World Cup 2026™ stage.',
    bgPcUrl: '/media/phase-detail/pc-3-bg.png',
    bgMwUrl: '/media/phase-detail/mw-3-bg.png',
    items: [
      {
        _key: '3-1',
        title: 'One Team',
        description:
          'The OMBCs selected from each country gather in Los Angeles for the first time to take part in the Kia OMBC Cup 2026™. Now, their second journey begins.',
        videoId: '',
        pcImageUrl: '/media/phase-detail/pc-3-item1.jpg',
        mwImageUrl: '/media/phase-detail/mw-3-item1.jpg',
      },
      {
        _key: '3-2',
        title: 'Boot Camp',
        description:
          'Through intensive training sessions and team-building activities, the OMBCs grow together under the mentorship of football legends.',
        videoId: '',
        pcImageUrl: '/media/phase-detail/pc-3-item2.jpg',
        mwImageUrl: '/media/phase-detail/mw-3-item2.jpg',
      },
      {
        _key: '3-3',
        title: '49th Team Photo',
        description:
          'The newly united squad captures its official team photo, celebrating the friendships and shared journey that define the 49th Team.',
        videoId: '',
        pcImageUrl: '/media/phase-detail/pc-3-item3.jpg',
        mwImageUrl: '/media/phase-detail/mw-3-item3.jpg',
      },
      {
        _key: '3-4',
        title: 'OMBC Cup Highlights',
        description:
          'Relive the unforgettable moments, inspiring goals, and unforgettable teamwork from the Kia OMBC Cup 2026™.',
        videoId: '',
        pcImageUrl: '/media/phase-detail/pc-3-item3.jpg',
        mwImageUrl: '/media/phase-detail/mw-3-item3.jpg',
      },
    ],
  },
  {
    _key: 'phase-4',
    anchorId: 'phase-4',
    eyebrow: 'Phase 4: FIFA World Cup 2026™',
    headline: 'The 49th Team Stepping onto the FIFA World Cup™ Stage',
    body: 'Now, the children step onto the FIFA World Cup 2026™ stage. As they enter the pitch carrying the official match ball, they become part of the opening moment of the match. And even after the final whistle, the journey of challenge and growth that began with the 49th Team continues on.',
    bgPcUrl: '/media/phase-detail/pc-4-bg.png',
    bgMwUrl: '/media/phase-detail/mw-4-bg.png',
    items: [
      {
        _key: '4-1',
        title: "Class of '26",
        description:
          'The children have long dreamed of stepping onto the FIFA World Cup™ stage — and now, as Official Match Ball Carriers, they finally take their place on that stage.',
        videoId: '',
        pcImageUrl: '/media/phase-detail/pc-4-item1.jpg',
        mwImageUrl: '/media/phase-detail/mw-4-item1.jpg',
      },
      {
        _key: '4-2',
        title: 'Legend Verdict',
        description:
          'Football legends reflect on the OMBCs’ remarkable journey, celebrating their growth, determination, and unforgettable achievements.',
        videoId: '',
        pcImageUrl: '/media/phase-detail/pc-4-item2.jpg',
        mwImageUrl: '/media/phase-detail/mw-4-item2.jpg',
      },
      {
        _key: '4-3',
        title: 'Forever 49th Team',
        description:
          'Although the tournament ends, the friendships, values, and memories of the 49th Team continue to inspire every child for years to come.',
        videoId: '',
        pcImageUrl: '/media/phase-detail/pc-4-item3.jpg',
        mwImageUrl: '/media/phase-detail/mw-4-item3.jpg',
      },
    ],
  },
]

type PhaseDetail = {
  _key: string
  anchorId: string
  eyebrow: string
  headline: string
  body: string | null
  bgPcUrl: string | null
  bgMwUrl: string | null
  items: {
    _key: string
    title: string
    description: string | null
    videoId: string | null
    pcImageUrl: string | null
    mwImageUrl: string | null
  }[]
}

function PhaseDetailCard({ phase }: { phase: PhaseDetail }) {
  const isDesktop = useIsDesktop()
  const [activeItem, setActiveItem] = useState(0)

  // Nút lên/xuống chỉ đơn giản chuyển mục đang active theo vòng lặp (loop vô hạn
  // như rule khách hàng yêu cầu) thay vì cuộn danh sách riêng biệt.
  const goto = (delta: number) => {
    setActiveItem((prev) => (prev + delta + phase.items.length) % phase.items.length)
  }

  // Phase chưa nhập item con nào (mảng lồng rỗng, ví dụ đang nhập dở trong CMS)
  // -- bỏ qua render phase này thay vì crash cả trang khi truy cập
  // phase.items[activeItem] trên mảng rỗng (không có ErrorBoundary nào bọc
  // quanh section này).
  if (phase.items.length === 0) return null

  const active = phase.items[activeItem]

  return (
   <section
  id={phase.anchorId}
  className=" isolate relative mx-2 my-3 scroll-mt-24 overflow-hidden rounded-2xl border border-white/10 bg-[#181C1F]/95 backdrop-blur-sm shadow-[0_40px_120px_rgba(0,0,0,0.55)] px-6 py-10 lg:mx-5 lg:my-4 lg:scroll-mt-28 lg:px-20 lg:py-[60px]">
      {/* Mobile: ảnh nền giữ đúng tỉ lệ gốc (340x191 -- asset MW cố định tỉ lệ
          này cho cả 4 phase), nằm trong luồng bình thường ở đầu card, bleed ra
          sát mép/góc bo tròn bằng margin âm, KHÔNG kéo giãn phủ kín cả card như
          trước (object-cover trên inset-0 với ảnh nguồn 340x191 bị zoom/crop cực
          mạnh khi card cao hơn nhiều so với 191px, mất hết bối cảnh ảnh gốc --
          đúng như ảnh Figma: thấy toàn bộ ảnh, có padding-top/background phía
          dưới, không phải ảnh bị scale). Desktop: giữ nguyên kiểu cũ (absolute
          inset-0 object-cover phủ kín card, ảnh PC vốn được export theo đúng tỉ
          lệ card rộng nên cover không bị crop bất thường). */}
      <div className="relative -mx-6 -mt-10 mb-6 aspect-[340/191] overflow-hidden pointer-events-none lg:absolute lg:inset-0 lg:-z-1 lg:mx-0 lg:mt-0 lg:mb-0 lg:aspect-auto lg:overflow-visible">
        {(isDesktop ? phase.bgPcUrl : phase.bgMwUrl) && (
          <img src={(isDesktop ? phase.bgPcUrl : phase.bgMwUrl) ?? undefined} alt=""
            className="size-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#181C1F] via-transparent to-transparent lg:bg-gradient-to-br lg:from-[#2f343b]/70 lg:via-[#3b4148]/45 lg:to-[#1f2428]/20" />
      </div>

      <motion.div
        initial={{ opacity: 0}}
        whileInView={{ opacity: 1}}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <p className="text-[16px] leading-6 text-white/60 lg:text-[20px] lg:leading-8">{phase.eyebrow}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{
          duration: 0.6,
          delay: 0.2,
          ease: 'easeOut',
        }}
      >

        <div className="mt-4 flex flex-col gap-4 lg:mt-6 lg:flex-row lg:gap-6">
          <h3 className="text-[28px] leading-[38px] text-white lg:w-[586px] lg:text-[36px] lg:leading-[54px]">
            {phase.headline}
          </h3>
          <p className="text-[14px] leading-6 text-[#cdd0d2] lg:w-[586px] lg:text-[16px] lg:leading-7">{phase.body}</p>
        </div>
      </motion.div>
      <div className="mt-8 flex flex-col gap-6 lg:mt-10 lg:flex-row lg:items-start">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.4 }}
          className="relative aspect-square w-full overflow-hidden rounded-xl lg:aspect-auto lg:h-[536px] lg:w-[952px]"
        >

          <AnimatePresence mode="wait">
            <motion.div
              key={activeItem}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="absolute inset-0"
            >
              <YouTubePlayer
                videoId={active.videoId ?? ''}
                title={active.title}
                thumbnail={(isDesktop ? active.pcImageUrl : active.mwImageUrl) ?? undefined}
              />
            </motion.div>
          </AnimatePresence>

        </motion.div>
        {/* Desktop: danh sách toàn bộ item cuộn dọc bên cạnh video, click để active.
            Mobile: chỉ hiện 1 item đang active + phân trang "01/0N" (đúng thiết kế
            Figma mobile -- khác hẳn desktop, không phải accordion list). */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.6 }}
          className="hidden items-start gap-4 lg:flex lg:gap-6"
        >
          <div className="flex w-full flex-col gap-3 overflow-y-auto lg:h-[536px] lg:w-[342px] lg:gap-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {phase.items.map((item, i) => {
              const isActive = i === activeItem
              return (
                <button
                  key={item._key}
                  type="button"
                  onClick={() => setActiveItem(i)}
                  style={{ backgroundImage: ITEM_GRADIENT }}
                  className="w-full rounded-xl px-6 py-6 text-left"
                >
                  <p className="text-[18px] leading-[30px] text-white">{item.title}</p>
                  <AnimatePresence initial={false}>
                    {isActive && item.description && (
                      <motion.p
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                        className="overflow-hidden text-[14px] leading-6 text-[#e8eaeb]"
                      >
                        {item.description}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </button>
              )
            })}
          </div>

          <div className="flex flex-col gap-5 lg:self-center">
            <button
              type="button"
              aria-label="Previous item"
              onClick={() => goto(-1)}
              className="flex size-[52px] items-center justify-center rounded-full border border-[#303e48] bg-[rgba(11,13,14,0.48)] shadow-lg"
            >
              <img src="/icons/ic-arrow-forward.svg" alt="" className="size-6 -rotate-90" />
            </button>
            <button
              type="button"
              aria-label="Next item"
              onClick={() => goto(1)}
              className="flex size-[52px] items-center justify-center rounded-full border border-[#303e48] bg-[rgba(11,13,14,0.48)] shadow-lg"
            >
              <img src="/icons/ic-arrow-back.svg" alt="" className="size-6 -rotate-90" />
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.6 }}
          className="flex flex-col gap-4 lg:hidden"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeItem}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <p className="text-[18px] leading-[30px] text-white">{active.title}</p>
              {active.description && (
                <p className="mt-2 text-[14px] leading-6 text-[#cdd0d2]">{active.description}</p>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-start gap-2">
            <button type="button" aria-label="Previous item" onClick={() => goto(-1)}>
              <img src="/icons/ic-arrow-back.svg" alt="" className="size-4" />
            </button>
            <p className="text-[14px] leading-6 text-white">
              <span className="font-bold">{String(activeItem + 1).padStart(2, '0')}</span>
              <span className="text-[#788187]"> /{String(phase.items.length).padStart(2, '0')}</span>
            </p>
            <button type="button" aria-label="Next item" onClick={() => goto(1)}>
              <img src="/icons/ic-arrow-forward.svg" alt="" className="size-4" />
            </button>
          </div>
        </motion.div>

      </div>
    </section>
  )
}

export default function PhaseDetails() {
  const { data: rawData } = usePayloadData<PayloadPhaseDetails>('phase-details')
  const data = normalizePhaseDetails(rawData)
  const phases = data?.phases?.length ? data.phases : FALLBACK_PHASES

  return (
    <div className="bg-black">
      {phases.map((phase) => (
        <PhaseDetailCard key={phase._key} phase={phase} />
      ))}
    </div>
  )
}
