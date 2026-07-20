// Làm phẳng response thô của Payload (upload field trả về object { url,...},
// mảng string trả về mảng { text }) thành đúng shape flat mà component/FALLBACK
// đang dùng -- vai trò tương đương phần ".asset->url" trong các GROQ query cũ.
// Mỗi Global thêm 1 hàm normalize riêng khi section đó được migrate.

type PayloadMedia = { url: string } | null | undefined

function mediaUrl(media: PayloadMedia): string | null {
  return media?.url ?? null
}

export interface PayloadHero {
  kvTitle: string | null
  kvHeadline: string | null
  kvSubheadline: string | null
  introShort: string | null
  introParagraphs: { text: string | null }[] | null
  pcVideo: PayloadMedia
  mobileVideo: PayloadMedia
  pcPoster: PayloadMedia
  mobilePoster: PayloadMedia
  logo: PayloadMedia
}

export interface HeroData {
  kvTitle: string | null
  kvHeadline: string | null
  kvSubheadline: string | null
  introShort: string | null
  introParagraphs: string[] | null
  pcVideoUrl: string | null
  mobileVideoUrl: string | null
  pcPosterUrl: string | null
  mobilePosterUrl: string | null
  logoUrl: string | null
}

export function normalizeHero(doc: PayloadHero | null): HeroData | null {
  if (!doc) return null
  return {
    kvTitle: doc.kvTitle ?? null,
    kvHeadline: doc.kvHeadline ?? null,
    kvSubheadline: doc.kvSubheadline ?? null,
    introShort: doc.introShort ?? null,
    introParagraphs: doc.introParagraphs?.map((p) => p.text ?? '').filter(Boolean) ?? null,
    pcVideoUrl: mediaUrl(doc.pcVideo),
    mobileVideoUrl: mediaUrl(doc.mobileVideo),
    pcPosterUrl: mediaUrl(doc.pcPoster),
    mobilePosterUrl: mediaUrl(doc.mobilePoster),
    logoUrl: mediaUrl(doc.logo),
  }
}

export interface PayloadSiteSettings {
  logo: PayloadMedia
  socialLinks: { id: string; platform: string | null; href: string | null }[] | null
  seo: {
    title: string | null
    description: string | null
    ogImage: PayloadMedia
  } | null
}

export interface SiteSettingsData {
  logoUrl: string | null
  socialLinks: { _key: string; platform: string; href: string }[] | null
  seo: { title: string | null; description: string | null; ogImageUrl: string | null } | null
}

export function normalizeSiteSettings(doc: PayloadSiteSettings | null): SiteSettingsData | null {
  if (!doc) return null
  return {
    logoUrl: mediaUrl(doc.logo),
    socialLinks:
      doc.socialLinks?.map((link) => ({
        _key: link.id,
        platform: link.platform ?? '',
        href: link.href ?? '',
      })) ?? null,
    seo: doc.seo
      ? {
          title: doc.seo.title ?? null,
          description: doc.seo.description ?? null,
          ogImageUrl: mediaUrl(doc.seo.ogImage),
        }
      : null,
  }
}

export interface PayloadHeader {
  navItems: { id: string; label: string | null; href: string | null }[] | null
}

export interface HeaderData {
  navItems: { _key: string; label: string; href: string }[] | null
}

export function normalizeHeader(doc: PayloadHeader | null): HeaderData | null {
  if (!doc) return null
  return {
    navItems:
      doc.navItems?.map((item) => ({
        _key: item.id,
        label: item.label ?? '',
        href: item.href ?? '',
      })) ?? null,
  }
}

export interface PayloadFooter {
  stayInspiredHeading: string | null
  stayInspiredCards: { id: string; image: PayloadMedia; title: string | null; subtitle: string | null }[] | null
  menuColumns:
    | {
        id: string
        title: string | null
        items: { id: string; label: string | null; href: string | null }[] | null
      }[]
    | null
  disclaimer1: string | null
  disclaimer2: string | null
}

export interface FooterData {
  stayInspiredHeading: string | null
  stayInspiredCards: { _key: string; imageUrl: string | null; title: string; subtitle: string | null }[] | null
  menuColumns: { _key: string; title: string; items: { _key: string; label: string; href: string }[] | null }[] | null
  disclaimer1: string | null
  disclaimer2: string | null
}

export function normalizeFooter(doc: PayloadFooter | null): FooterData | null {
  if (!doc) return null
  return {
    stayInspiredHeading: doc.stayInspiredHeading ?? null,
    stayInspiredCards:
      doc.stayInspiredCards?.map((card) => ({
        _key: card.id,
        imageUrl: mediaUrl(card.image),
        title: card.title ?? '',
        subtitle: card.subtitle ?? null,
      })) ?? null,
    menuColumns:
      doc.menuColumns?.map((col) => ({
        _key: col.id,
        title: col.title ?? '',
        items:
          col.items?.map((item) => ({
            _key: item.id,
            label: item.label ?? '',
            href: item.href ?? '',
          })) ?? null,
      })) ?? null,
    disclaimer1: doc.disclaimer1 ?? null,
    disclaimer2: doc.disclaimer2 ?? null,
  }
}

export interface PayloadMainFilmCarousel {
  films:
    | {
        id: string
        title: string | null
        videoId: string | null
        pcThumbnail: PayloadMedia
        mwThumbnail: PayloadMedia
      }[]
    | null
}

export interface MainFilmCarouselData {
  films:
    | {
        _key: string
        title: string | null
        videoId: string | null
        pcThumbnailUrl: string | null
        mwThumbnailUrl: string | null
      }[]
    | null
}

export function normalizeMainFilmCarousel(doc: PayloadMainFilmCarousel | null): MainFilmCarouselData | null {
  if (!doc) return null
  return {
    films:
      doc.films?.map((film) => ({
        _key: film.id,
        title: film.title ?? null,
        videoId: film.videoId ?? null,
        pcThumbnailUrl: mediaUrl(film.pcThumbnail),
        mwThumbnailUrl: mediaUrl(film.mwThumbnail),
      })) ?? null,
  }
}

export interface PayloadPhaseOverview {
  heading: string | null
  bodyParagraphs: { text: string | null }[] | null
  phases:
    | {
        id: string
        anchorId: string | null
        label: string | null
        title: string | null
        subtitle: string | null
        pcImage: PayloadMedia
        mwImage: PayloadMedia
      }[]
    | null
}

export interface PhaseOverviewData {
  heading: string | null
  bodyParagraphs: string[] | null
  phases:
    | {
        _key: string
        anchorId: string
        label: string
        title: string
        subtitle: string | null
        pcImageUrl: string | null
        mwImageUrl: string | null
      }[]
    | null
}

export function normalizePhaseOverview(doc: PayloadPhaseOverview | null): PhaseOverviewData | null {
  if (!doc) return null
  return {
    heading: doc.heading ?? null,
    bodyParagraphs: doc.bodyParagraphs?.map((p) => p.text ?? '').filter(Boolean) ?? null,
    phases:
      doc.phases?.map((phase) => ({
        _key: phase.id,
        anchorId: phase.anchorId ?? '',
        label: phase.label ?? '',
        title: phase.title ?? '',
        subtitle: phase.subtitle ?? null,
        pcImageUrl: mediaUrl(phase.pcImage),
        mwImageUrl: mediaUrl(phase.mwImage),
      })) ?? null,
  }
}

export interface PayloadPhaseDetails {
  phases:
    | {
        id: string
        anchorId: string | null
        eyebrow: string | null
        headline: string | null
        body: string | null
        bgPc: PayloadMedia
        bgMw: PayloadMedia
        items:
          | {
              id: string
              title: string | null
              description: string | null
              videoId: string | null
              pcImage: PayloadMedia
              mwImage: PayloadMedia
            }[]
          | null
      }[]
    | null
}

export interface PhaseDetailsData {
  phases:
    | {
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
      }[]
    | null
}

export interface PayloadWatchMore {
  heading: string | null
  body: string | null
  buttonTitle: string | null
  buttonSubtitle: string | null
  buttonHref: string | null
  pcImage: PayloadMedia
  mwImage: PayloadMedia
}

export interface WatchMoreData {
  heading: string | null
  body: string | null
  buttonTitle: string | null
  buttonSubtitle: string | null
  buttonHref: string | null
  pcImageUrl: string | null
  mwImageUrl: string | null
}

export function normalizeWatchMore(doc: PayloadWatchMore | null): WatchMoreData | null {
  if (!doc) return null
  return {
    heading: doc.heading ?? null,
    body: doc.body ?? null,
    buttonTitle: doc.buttonTitle ?? null,
    buttonSubtitle: doc.buttonSubtitle ?? null,
    buttonHref: doc.buttonHref ?? null,
    pcImageUrl: mediaUrl(doc.pcImage),
    mwImageUrl: mediaUrl(doc.mwImage),
  }
}

export interface PayloadExperienceCarousel {
  heading: string | null
  body: string | null
  experiences:
    | {
        id: string
        title: string | null
        description: string | null
        pcImage: PayloadMedia
        thumbImage: PayloadMedia
        mwImage: PayloadMedia
      }[]
    | null
}

export interface ExperienceCarouselData {
  heading: string | null
  body: string | null
  experiences:
    | {
        _key: string
        title: string
        description: string | null
        pcImageUrl: string | null
        thumbImageUrl: string | null
        mwImageUrl: string | null
      }[]
    | null
}

export function normalizeExperienceCarousel(doc: PayloadExperienceCarousel | null): ExperienceCarouselData | null {
  if (!doc) return null
  return {
    heading: doc.heading ?? null,
    body: doc.body ?? null,
    experiences:
      doc.experiences?.map((item) => ({
        _key: item.id,
        title: item.title ?? '',
        description: item.description ?? null,
        pcImageUrl: mediaUrl(item.pcImage),
        thumbImageUrl: mediaUrl(item.thumbImage),
        mwImageUrl: mediaUrl(item.mwImage),
      })) ?? null,
  }
}

export interface PayloadConnectStore {
  heading: string | null
  body: string | null
  buttonTitle: string | null
  buttonHref: string | null
  pcImage: PayloadMedia
  mwImage: PayloadMedia
}

export interface ConnectStoreData {
  heading: string | null
  body: string | null
  buttonTitle: string | null
  buttonHref: string | null
  pcImageUrl: string | null
  mwImageUrl: string | null
}

export function normalizeConnectStore(doc: PayloadConnectStore | null): ConnectStoreData | null {
  if (!doc) return null
  return {
    heading: doc.heading ?? null,
    body: doc.body ?? null,
    buttonTitle: doc.buttonTitle ?? null,
    buttonHref: doc.buttonHref ?? null,
    pcImageUrl: mediaUrl(doc.pcImage),
    mwImageUrl: mediaUrl(doc.mwImage),
  }
}

export interface PayloadOutro {
  paragraphs: { id: string; text: string | null; bold: boolean | null }[] | null
  pcImage: PayloadMedia
  mwImage: PayloadMedia
}

export interface OutroData {
  paragraphs: { _key: string; text: string; bold: boolean | null }[] | null
  pcImageUrl: string | null
  mwImageUrl: string | null
}

export function normalizeOutro(doc: PayloadOutro | null): OutroData | null {
  if (!doc) return null
  return {
    paragraphs:
      doc.paragraphs?.map((p) => ({
        _key: p.id,
        text: p.text ?? '',
        bold: p.bold ?? false,
      })) ?? null,
    pcImageUrl: mediaUrl(doc.pcImage),
    mwImageUrl: mediaUrl(doc.mwImage),
  }
}

export function normalizePhaseDetails(doc: PayloadPhaseDetails | null): PhaseDetailsData | null {
  if (!doc) return null
  return {
    phases:
      doc.phases?.map((phase) => ({
        _key: phase.id,
        anchorId: phase.anchorId ?? '',
        eyebrow: phase.eyebrow ?? '',
        headline: phase.headline ?? '',
        body: phase.body ?? null,
        bgPcUrl: mediaUrl(phase.bgPc),
        bgMwUrl: mediaUrl(phase.bgMw),
        items:
          phase.items?.map((item) => ({
            _key: item.id,
            title: item.title ?? '',
            description: item.description ?? null,
            videoId: item.videoId ?? null,
            pcImageUrl: mediaUrl(item.pcImage),
            mwImageUrl: mediaUrl(item.mwImage),
          })) ?? [],
      })) ?? null,
  }
}
