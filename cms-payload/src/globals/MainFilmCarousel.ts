import type { GlobalConfig } from 'payload'
import { publicRead } from '../access/publicRead'

export const MainFilmCarousel: GlobalConfig = {
  slug: 'main-film-carousel',
  label: 'Carousel phim chính',
  access: { read: publicRead },
  fields: [
    {
      name: 'films',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'videoId', type: 'text', required: true },
        { name: 'pcThumbnail', type: 'upload', relationTo: 'media' },
        { name: 'mwThumbnail', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}
