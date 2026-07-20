import { usePayloadData } from './usePayloadData'
import { normalizeSiteSettings, type PayloadSiteSettings } from '../lib/normalize'

// Dữ liệu dùng chung nhiều nơi trên site (logo, social links, SEO mặc định) --
// tách khỏi từng section vì không thuộc riêng section nào (xem CLAUDE.md mục
// "CMS"). Fallback theo từng field như các hook section khác.
const FALLBACK = {
  logoUrl: '/icons/kia-logo.svg',
  socialLinks: [] as { _key: string; platform: string; href: string }[],
  seoTitle: 'Kia OMBC — FIFA World Cup 2026™',
  seoDescription:
    'Kia — Official Partner of the FIFA World Cup 2026™. Discover the 49th Team and the Official Match Ball Carrier (OMBC) program.',
  seoOgImageUrl: null as string | null,
}

export function useSiteSettings() {
  const { data: rawData } = usePayloadData<PayloadSiteSettings>('site-settings')
  const data = normalizeSiteSettings(rawData)
  return {
    logoUrl: data?.logoUrl ?? FALLBACK.logoUrl,
    socialLinks: data?.socialLinks?.length ? data.socialLinks : FALLBACK.socialLinks,
    seoTitle: data?.seo?.title ?? FALLBACK.seoTitle,
    seoDescription: data?.seo?.description ?? FALLBACK.seoDescription,
    seoOgImageUrl: data?.seo?.ogImageUrl ?? FALLBACK.seoOgImageUrl,
  }
}
