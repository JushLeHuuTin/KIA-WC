import { motion } from 'motion/react'
import { useSanityData } from '../../hooks/useSanityData'
import { useSiteSettings } from '../../hooks/useSiteSettings'
import { FOOTER_QUERY } from '../../lib/queries'

// Nội dung mặc định -- dùng khi Sanity chưa có document `footer` hoặc field
// nào chưa được nhập (xem quy ước fallback trong CLAUDE.md).
// Copy + cấu trúc lấy đúng từ Figma (get_design_context node 1:1490) — 3 card "Stay
// Inspired" dùng chung 1 title/subtitle cho cả 3 ảnh khác nhau, đây là design thật
// (không phải placeholder), đã xác nhận qua ảnh export trực tiếp từ Figma.
const FALLBACK_STAY_INSPIRED_HEADING = 'Stay Inspired'
const FALLBACK_STAY_INSPIRED_CARDS = [
  { _key: '1', imageUrl: '/media/footer/card-1.jpg', title: 'From Innovation to Impact', subtitle: '지속가능한 내일로 가는 길' },
  { _key: '2', imageUrl: '/media/footer/card-2.jpg', title: 'From Innovation to Impact', subtitle: '지속가능한 내일로 가는 길' },
  { _key: '3', imageUrl: '/media/footer/card-3.jpg', title: 'From Innovation to Impact', subtitle: '지속가능한 내일로 가는 길' },
]
const FALLBACK_MENU_COLUMNS = [
  {
    _key: 'ir',
    title: 'Investor Relations',
    items: [
      { _key: 'ir-1', label: 'IR Highlights', href: '#' },
      { _key: 'ir-2', label: 'Corporate', href: '#' },
      { _key: 'ir-3', label: 'Financial', href: '#' },
      { _key: 'ir-4', label: 'Official Notice', href: '#' },
      { _key: 'ir-5', label: 'Library', href: '#' },
    ],
  },
  {
    _key: 'sustainability',
    title: 'Sustainability',
    items: [
      { _key: 'sus-1', label: 'ESG', href: '#' },
      { _key: 'sus-2', label: 'Environmental', href: '#' },
      { _key: 'sus-3', label: 'Social', href: '#' },
      { _key: 'sus-4', label: 'Governance', href: '#' },
    ],
  },
  {
    _key: 'movement',
    title: 'Join the Movement',
    items: [{ _key: 'mv-1', label: 'Career', href: '#' }],
  },
]
const FALLBACK_DISCLAIMER_1 =
  '본 사이트에는 글로벌 사양의 모델이 사용되었습니다. 실제 차량의 사양, 기능, 소프트웨어 동작은 모델, 시장, 생산 시점, 선택 사양에 따라 달라질 수 있습니다. 일부 이미지 또는 영상은 연출, 시뮬레이션, 혹은 전문 운전자에 의해 촬영된 장면을 포함할 수 있으며, 공식 양산 전 사전 제작 모델 기준으로 제작되어 최종 제품과 다를 수 있습니다. 영상 속 주행 장면을 따라 하지 마십시오. 항상 안전하게 운전하고 관련 교통법규를 준수하십시오. 자세한 내용은 차량의 오너스 매뉴얼을 참고하십시오.'
const FALLBACK_DISCLAIMER_2 =
  '페이지 내 사용된 일부 시각 요소는 인공지능(AI) 기반 이미지 생성 도구를 통해 제작되었으며, 실제 인물이나 장소 또는 사건을 묘사한 것이 아닙니다. 본 콘텐츠는 당사의 윤리 및 법적 기준을 준수하여 사용되고 있습니다.'

interface FooterData {
  stayInspiredHeading: string | null
  stayInspiredCards: { _key: string; imageUrl: string | null; title: string; subtitle: string | null }[] | null
  menuColumns: { _key: string; title: string; items: { _key: string; label: string; href: string }[] | null }[] | null
  disclaimer1: string | null
  disclaimer2: string | null
}

// Icon mạng xã hội là ảnh cố định (logo từng nền tảng) -- chỉ đường dẫn (href)
// lấy từ Site Settings, map theo tên platform. Nút "Family Site"/"Change
// Region", link điều khoản/chính sách và dòng bản quyền là UI/pháp lý cố định
// của Kia, không lấy từ CMS.
const SOCIAL_ICONS = [
  { name: 'Instagram', src: '/icons/social/instagram.svg' },
  { name: 'Facebook', src: '/icons/social/facebook.svg' },
  { name: 'LinkedIn', src: '/icons/social/linkedin.svg' },
  { name: 'X', src: '/icons/social/twitter.svg' },
  { name: 'YouTube', src: '/icons/social/youtube.svg' },
]

export default function Footer() {
  const { logoUrl, socialLinks } = useSiteSettings()
  const { data } = useSanityData<FooterData>(FOOTER_QUERY)
  const stayInspiredHeading = data?.stayInspiredHeading ?? FALLBACK_STAY_INSPIRED_HEADING
  const stayInspiredCards = data?.stayInspiredCards?.length ? data.stayInspiredCards : FALLBACK_STAY_INSPIRED_CARDS
  const menuColumns = data?.menuColumns?.length ? data.menuColumns : FALLBACK_MENU_COLUMNS
  const disclaimer1 = data?.disclaimer1 ?? FALLBACK_DISCLAIMER_1
  const disclaimer2 = data?.disclaimer2 ?? FALLBACK_DISCLAIMER_2

  return (
    <footer className="bg-black px-2 pb-2 pt-3 lg:px-5 lg:pb-5 lg:pt-4 relative -top-40">
      {/* Stay Inspired */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="rounded-2xl bg-white/10 px-6 py-10 lg:px-20 lg:py-[60px]"
      >
        <h2 className="text-[28px] leading-[42px] text-white lg:text-[36px] lg:leading-[54px]">{stayInspiredHeading}</h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3 lg:mt-12 lg:gap-6">
          {stayInspiredCards.map((card) => (
            <div key={card._key} className="flex flex-col gap-4">
              <div className="aspect-[464/260] overflow-hidden rounded-xl">
                <img src={card.imageUrl ?? undefined} alt={card.title} className="size-full object-cover" />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-[16px] font-bold leading-7 text-white lg:text-[18px] lg:leading-[30px]">{card.title}</p>
                <p className="text-[13px] leading-6 text-[#cdd0d2] lg:text-[14px]">{card.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Site footer chính */}
      <div className="mt-2 rounded-2xl  px-6 pb-8 pt-10 lg:mt-4 lg:px-20 lg:pb-12 lg:pt-[60px]">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <img src={logoUrl} alt="Kia" className="h-6 w-auto lg:h-8" />
          <div className="flex flex-col gap-8 lg:flex-row lg:gap-[60px]">
            {menuColumns.map((col) => (
              <div key={col._key} className="flex flex-col gap-4 lg:w-[240px]">
                <p className="text-[12px] leading-5 text-[#788187]">{col.title}</p>
                {/* Mobile: các link wrap ngang trong cùng 1 cột (đúng thiết kế mobile
                    Figma) -- khác desktop, nơi mỗi link xuống dòng riêng. */}
                <div className="flex flex-wrap gap-x-6 gap-y-2 lg:flex-col lg:gap-0">
                  {(col.items ?? []).map((item) => (
                    <a key={item._key} href={item.href} className="text-[14px] leading-6 text-white lg:py-2">
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-6 lg:mt-6">
          <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex items-center gap-3">
              {SOCIAL_ICONS.map((icon) => (
                <a
                  key={icon.name}
                  href={socialLinks.find((link) => link.platform === icon.name)?.href ?? '#'}
                  aria-label={icon.name}
                  className="flex items-center rounded bg-white/10 p-2"
                >
                  <img src={icon.src} alt="" className="size-6" />
                </a>
              ))}
            </div>
            <div className="flex items-center gap-8">
              <button type="button" className="flex items-center gap-1.5 text-[13px] leading-[22px] text-[#8d959a]">
                Family Site
                <img src="/icons/ic-dropdown.svg" alt="" className="size-3" />
              </button>
              <button type="button" className="flex items-center gap-1.5 text-[13px] leading-[22px] text-[#8d959a]">
                <img src="/icons/ic-globe.svg" alt="" className="size-4" />
                Change Region
              </button>
            </div>
          </div>

          <div className="border-t border-white/10" />

          <div className="flex items-center gap-6 text-[14px] font-bold leading-6 text-[#788187]">
            <p>이용약관</p>
            <p>개인정보 처리방침</p>
          </div>

          <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-col gap-3 text-[13px] leading-[22px] text-[#636d74]">
              <p>{disclaimer1}</p>
              <p>{disclaimer2}</p>
            </div>
            <p className="shrink-0 text-[12px] leading-5 text-[#636d74]">© Kia Corporation</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
