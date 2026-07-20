import type { GlobalConfig } from 'payload'
import { publicRead } from '../access/publicRead'

export const ExperienceCarousel: GlobalConfig = {
  slug: 'experience-carousel',
  label: 'Carousel Trải nghiệm',
  access: { read: publicRead },
  fields: [
    { name: 'heading', type: 'text', required: true },
    { name: 'body', type: 'textarea' },
    {
      name: 'experiences',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
        { name: 'pcImage', type: 'upload', relationTo: 'media' },
        { name: 'thumbImage', type: 'upload', relationTo: 'media' },
        { name: 'mwImage', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}
