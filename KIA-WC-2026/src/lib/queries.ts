// Toàn bộ query GROQ dùng chung cho trang -- mỗi section là 1 singleton document
// (xem cms-kia/structure.ts), nên luôn query theo _id cố định thay vì _type.

export const SITE_SETTINGS_QUERY = /* groq */ `
*[_id == "siteSettings"][0]{
  "logoUrl": logo.asset->url,
  socialLinks[]{
    _key,
    platform,
    href
  },
  seo{
    title,
    description,
    "ogImageUrl": ogImage.asset->url
  }
}
`

export const HERO_QUERY = /* groq */ `
*[_id == "hero"][0]{
  kvTitle,
  kvHeadline,
  kvSubheadline,
  introShort,
  introParagraphs,
  "pcVideoUrl": pcVideo.asset->url,
  "mobileVideoUrl": mobileVideo.asset->url,
  "pcPosterUrl": pcPoster.asset->url,
  "mobilePosterUrl": mobilePoster.asset->url,
  "logoUrl": logo.asset->url
}
`

export const HEADER_QUERY = /* groq */ `
*[_id == "header"][0]{
  navItems[]{
    _key,
    label,
    href
  }
}
`

export const MAIN_FILM_CAROUSEL_QUERY = /* groq */ `
*[_id == "mainFilmCarousel"][0]{
  films[]{
    _key,
    title,
    videoId,
    "pcThumbnailUrl": pcThumbnail.asset->url,
    "mwThumbnailUrl": mwThumbnail.asset->url
  }
}
`

export const PHASE_OVERVIEW_QUERY = /* groq */ `
*[_id == "phaseOverview"][0]{
  heading,
  bodyParagraphs,
  phases[]{
    _key,
    anchorId,
    label,
    title,
    subtitle,
    "pcImageUrl": pcImage.asset->url,
    "mwImageUrl": mwImage.asset->url
  }
}
`

export const WATCH_MORE_QUERY = /* groq */ `
*[_id == "watchMore"][0]{
  heading,
  body,
  buttonTitle,
  buttonSubtitle,
  buttonHref,
  "pcImageUrl": pcImage.asset->url,
  "mwImageUrl": mwImage.asset->url
}
`

export const EXPERIENCE_CAROUSEL_QUERY = /* groq */ `
*[_id == "experienceCarousel"][0]{
  heading,
  body,
  experiences[]{
    _key,
    title,
    description,
    "pcImageUrl": pcImage.asset->url,
    "thumbImageUrl": thumbImage.asset->url,
    "mwImageUrl": mwImage.asset->url
  }
}
`

export const CONNECT_STORE_QUERY = /* groq */ `
*[_id == "connectStore"][0]{
  heading,
  body,
  buttonTitle,
  buttonHref,
  "pcImageUrl": pcImage.asset->url,
  "mwImageUrl": mwImage.asset->url
}
`

export const OUTRO_QUERY = /* groq */ `
*[_id == "outro"][0]{
  paragraphs[]{
    _key,
    text,
    bold
  },
  "pcImageUrl": pcImage.asset->url,
  "mwImageUrl": mwImage.asset->url
}
`

export const FOOTER_QUERY = /* groq */ `
*[_id == "footer"][0]{
  stayInspiredHeading,
  stayInspiredCards[]{
    _key,
    "imageUrl": image.asset->url,
    title,
    subtitle
  },
  menuColumns[]{
    _key,
    title,
    items[]{
      _key,
      label,
      href
    }
  },
  disclaimer1,
  disclaimer2
}
`

export const PHASE_DETAILS_QUERY = /* groq */ `
*[_id == "phaseDetails"][0]{
  phases[]{
    _key,
    anchorId,
    eyebrow,
    headline,
    body,
    "bgPcUrl": bgPc.asset->url,
    "bgMwUrl": bgMw.asset->url,
    items[]{
      _key,
      title,
      description,
      videoId,
      "pcImageUrl": pcImage.asset->url,
      "mwImageUrl": mwImage.asset->url
    }
  }
}
`
