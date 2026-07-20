import { motion } from 'motion/react'
import { useIsDesktop } from '../../hooks/useMediaQuery'
import { usePayloadData } from '../../hooks/usePayloadData'
import { normalizePhaseOverview, type PayloadPhaseOverview } from '../../lib/normalize'

// Nội dung mặc định -- dùng khi Sanity chưa có document `phaseOverview` hoặc
// field nào chưa được nhập (xem quy ước fallback trong CLAUDE.md).
const FALLBACK_HEADING = "Official Match Ball Carrier, The World Cup™'s 49th Team"
const FALLBACK_BODY_PARAGRAPHS = [
  'The FIFA World Cup 2026™ — the largest in history, bringing together 48 nations. On that stage, one final team takes its place.',
  'Rising football talents selected through local auditions around the world come together at the Kia OMBC Cup 2026™. More than just a tournament, it is a space where inspiration flows between players — children learning from legends, sharing the same dream with new friends, connected through the universal language of the game. United as one, they come together as the 49th Team stepping onto the FIFA World Cup™ stage. Discover their stories — united by passion for football and shared dreams.',
]
const FALLBACK_PHASES = [
  {
    _key: 'phase-1',
    anchorId: 'phase-1',
    label: 'Phase 1',
    title: 'The Calling',
    subtitle: 'A Call Toward a Dream',
    pcImageUrl: '/media/phases/pc-phase1.jpg',
    mwImageUrl: '/media/phases/mw-phase1.jpg',
  },
  {
    _key: 'phase-2',
    anchorId: 'phase-2',
    label: 'Phase 2',
    title: 'Local Audition',
    subtitle: 'Chosen by Legends',
    pcImageUrl: '/media/phases/pc-phase2.jpg',
    mwImageUrl: '/media/phases/mw-phase2.jpg',
  },
  {
    _key: 'phase-3',
    anchorId: 'phase-3',
    label: 'Phase 3',
    title: 'Kia OMBC Cup 2026™',
    subtitle: 'Becoming One Team',
    pcImageUrl: '/media/phases/pc-phase3.jpg',
    mwImageUrl: '/media/phases/mw-phase3.jpg',
  },
  {
    _key: 'phase-4',
    anchorId: 'phase-4',
    label: 'Phase 4',
    title: 'FIFA World Cup 2026™',
    subtitle: 'The 49th Team Stepping onto the FIFA World Cup™ Stage',
    pcImageUrl: '/media/phases/pc-phase4.jpg',
    mwImageUrl: '/media/phases/mw-phase4.jpg',
  },
]

type Phase = {
  _key: string
  anchorId: string
  label: string
  title: string
  subtitle: string | null
  pcImageUrl: string | null
  mwImageUrl: string | null
}

function PhaseCard({ phase, image }: { phase: Phase; image?: string }) {
  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-xl lg:aspect-[342/456]">
      {image ? (
        <img src={image} alt="" className="absolute inset-0 size-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-[#1c1f21]" />
      )}
      <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-black/60 to-transparent" />
      <p className="absolute left-6 top-6 bg-gradient-to-b from-[#f3f4f5] to-[#f3f4f5]/0 bg-clip-text text-[40px] font-light leading-none text-transparent lg:text-[52px]">
        {phase.label}
      </p>
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-4 bg-gradient-to-b from-transparent to-black/40 px-6 pb-9 pt-12">
        <div className="flex flex-col items-start gap-2">
          <p className="text-[18px] leading-[30px] text-white">{phase.title}</p>
          <p className="text-[14px] leading-6 text-[#cdd0d2]">{phase.subtitle}</p>
        </div>
        <a
          href={`#${phase.anchorId}`}
          onClick={(e) => {
            e.preventDefault()
            document.getElementById(phase.anchorId)?.scrollIntoView({ behavior: 'smooth' })
          }}
          className="flex m-auto items-center lg:m-0 gap-2 text-[16px] leading-7 text-white"
        >
          Go to section
          <span className="flex size-7 items-center justify-center rounded-full border border-[#636d74]">
            <img src="/icons/ic-arrow-downward.svg" alt="" className="size-3" />
          </span>
        </a>
      </div>
    </div>
  )
}

export default function PhaseOverview() {
  const isDesktop = useIsDesktop()
  const { data: rawData } = usePayloadData<PayloadPhaseOverview>('phase-overview')
  const data = normalizePhaseOverview(rawData)
  const heading = data?.heading ?? FALLBACK_HEADING
  const bodyParagraphs = data?.bodyParagraphs?.length ? data.bodyParagraphs : FALLBACK_BODY_PARAGRAPHS
  const phases = data?.phases?.length ? data.phases : FALLBACK_PHASES

  return (
    <section className="bg-black px-2 py-6 lg:px-5 lg:py-10">
      <div className="rounded-2xl bg-[#e8eaeb] px-6 pb-10 pt-12 lg:px-20 lg:pb-16 lg:pt-[60px]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex flex-col items-start gap-4 lg:w-[586px] lg:gap-5"
        >
          <h2 className="text-[24px] leading-9 text-[#05141f] lg:text-[36px] lg:leading-[54px]">
            {heading}
          </h2>
          <div className="flex flex-col items-start gap-2 text-[14px] leading-6 text-[#303e48] lg:w-[464px] lg:gap-4 lg:text-[16px] lg:leading-7">
            {bodyParagraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 gap-4 lg:mt-14 lg:grid-cols-4 lg:gap-6">
          {phases.map((phase, i) => (
            <motion.div
              key={phase._key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: i * 0.1 }}
            >
              <PhaseCard phase={phase} image={(isDesktop ? phase.pcImageUrl : phase.mwImageUrl) ?? undefined} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
