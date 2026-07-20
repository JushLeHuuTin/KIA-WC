import type { GlobalConfig } from 'payload'
import { publicRead } from '../access/publicRead'

export const Hero: GlobalConfig = {
  slug: 'hero',
  label: 'Hero (Mở đầu)',
  access: { read: publicRead },
  fields: [
    { name: 'kvTitle', type: 'text' },
    { name: 'kvHeadline', type: 'text' },
    { name: 'kvSubheadline', type: 'textarea' },
    { name: 'introShort', type: 'text' },
    {
      name: 'introParagraphs',
      type: 'array',
      fields: [{ name: 'text', type: 'textarea' }],
    },
    { name: 'pcVideo', type: 'upload', relationTo: 'media' },
    { name: 'mobileVideo', type: 'upload', relationTo: 'media' },
    { name: 'pcPoster', type: 'upload', relationTo: 'media' },
    { name: 'mobilePoster', type: 'upload', relationTo: 'media' },
    { name: 'logo', type: 'upload', relationTo: 'media' },
  ],
}
