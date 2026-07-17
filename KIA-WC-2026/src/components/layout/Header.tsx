import { useSanityData } from '../../hooks/useSanityData'
import { useSiteSettings } from '../../hooks/useSiteSettings'
import { HEADER_QUERY } from '../../lib/queries'

// Nội dung mặc định -- dùng khi Sanity chưa có document `header` hoặc field nào
// đó chưa được nhập (fallback theo từng field, xem quy ước trong CLAUDE.md).
// Logo lấy từ Site Settings (dùng chung với Footer), không phải field riêng ở đây.
const FALLBACK_NAV_ITEMS = [
  { _key: 'brand', label: 'Brand', href: '#brand' },
  { _key: 'design', label: 'Design', href: '#design' },
  { _key: 'vehicle', label: 'Vehicle', href: '#vehicle' },
  { _key: 'innovation', label: 'Innovation', href: '#innovation' },
  { _key: 'newsroom', label: 'Newsroom', href: '#newsroom' },
]

interface HeaderData {
  navItems: { _key: string; label: string; href: string }[] | null
}

export default function Header() {
  const { logoUrl } = useSiteSettings()
  const { data } = useSanityData<HeaderData>(HEADER_QUERY)
  const navItems = data?.navItems?.length ? data.navItems : FALLBACK_NAV_ITEMS

  return (
    <header className="fixed top-0 left-0 z-50 flex w-full items-center justify-between px-6 py-5 lg:px-20 lg:py-6">
      <img src={logoUrl} alt="Kia" className="h-6 w-auto lg:h-8" />

      <nav className="hidden items-center lg:flex">
        {navItems.map((item) => (
          <a
            key={item._key}
            href={item.href}
            className="px-5 py-2 font-bold text-[16px] leading-7 text-white"
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div className="flex items-center gap-3 lg:gap-6">
        <div className="hidden items-center gap-3 text-[13px] text-white lg:flex">
          <span className="leading-[22px]">KR</span>
          <span className="h-3 w-px bg-white opacity-30" />
          <span className="font-bold leading-[22px]">EN</span>
        </div>
        <button type="button" aria-label="Search">
          <img src="/icons/ic-search.svg" alt="" className="size-5" />
        </button>
        <button type="button" aria-label="Menu" className="lg:hidden">
          <img src="/icons/ic-menu.svg" alt="" className="size-5" />
        </button>
      </div>
    </header>
  )
}
