import type { GlobalConfig } from 'payload'
import { publicRead } from '../access/publicRead'

export const MainFilmCarousel: GlobalConfig = {
  slug: 'main-film-carousel',
  label: 'Carousel phim chính',
  admin: { group: 'Nội dung trang' },
  access: { read: publicRead },
  fields: [
    {
      name: 'films',
      type: 'array',
      label: 'Danh sách phim',
      labels: { singular: 'Phim', plural: 'Phim' },
      minRows: 1,
      fields: [
        { name: 'title', type: 'text', required: true, label: 'Tên phim' },
        { name: 'videoId', type: 'text', required: true, label: 'ID video YouTube' },
        { name: 'pcThumbnail', type: 'upload', relationTo: 'media', label: 'Ảnh thumbnail (máy tính)' },
        { name: 'mwThumbnail', type: 'upload', relationTo: 'media', label: 'Ảnh thumbnail (điện thoại)' },
      ],
    },
  ],
}
