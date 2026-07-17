import { useSanityData } from './useSanityData'
import { SITE_SETTINGS_QUERY } from '../lib/queries'

// Dữ liệu dùng chung nhiều nơi trên site (logo, social links, SEO mặc định) --
// tách khỏi từng section vì không thuộc riêng section nào (xem CLAUDE.md mục
// "CMS (Sanity)"). Fallback theo từng field như các hook section khác.
const FALLBACK = {
  logoUrl: '/icons/kia-logo.svg',
  socialLinks: [] as { _key: string; platform: string; href: string }[],
  seoTitle: 'Kia OMBC — FIFA World Cup 2026™',
  seoDescription:
    'Kia — Official Partner of the FIFA World Cup 2026™. Discover the 49th Team and the Official Match Ball Carrier (OMBC) program.',
  seoOgImageUrl: null as string | null,
}

interface SiteSettingsData {
  logoUrl: string | null
  socialLinks: { _key: string; platform: string; href: string }[] | null
  seo: { title: string | null; description: string | null; ogImageUrl: string | null } | null
}

export function useSiteSettings() {
  const { data } = useSanityData<SiteSettingsData>(SITE_SETTINGS_QUERY)
  return {
    logoUrl: data?.logoUrl ?? FALLBACK.logoUrl,
    socialLinks: data?.socialLinks?.length ? data.socialLinks : FALLBACK.socialLinks,
    seoTitle: data?.seo?.title ?? FALLBACK.seoTitle,
    seoDescription: data?.seo?.description ?? FALLBACK.seoDescription,
    seoOgImageUrl: data?.seo?.ogImageUrl ?? FALLBACK.seoOgImageUrl,
  }
}
