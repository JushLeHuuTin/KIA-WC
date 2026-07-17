const NAV_ITEMS = ['Brand', 'Design', 'Vehicle', 'Innovation', 'Newsroom']

export default function Header() {
  return (
    <header className="fixed top-0 left-0 z-50 flex w-full items-center justify-between px-6 py-5 lg:px-20 lg:py-6">
      <img src="/icons/kia-logo.svg" alt="Kia" className="h-6 w-auto" />

      <nav className="hidden items-center lg:flex">
        {NAV_ITEMS.map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            className="px-5 py-2 font-bold text-[16px] leading-7 text-white"
          >
            {item}
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
          <img src="/icons/ic-search.svg" alt="" className="size-6" />
        </button>
        <button type="button" aria-label="Menu" className="lg:hidden">
          <img src="/icons/ic-menu.svg" alt="" className="size-6" />
        </button>
      </div>
    </header>
  )
}
