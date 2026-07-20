import type { GlobalConfig } from 'payload'
import { publicRead } from '../access/publicRead'

export const PhaseOverview: GlobalConfig = {
  slug: 'phase-overview',
  label: 'Tổng quan các Phase',
  access: { read: publicRead },
  fields: [
    { name: 'heading', type: 'text' },
    {
      name: 'bodyParagraphs',
      type: 'array',
      fields: [{ name: 'text', type: 'textarea' }],
    },
    {
      name: 'phases',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'anchorId', type: 'text', required: true },
        { name: 'label', type: 'text', required: true },
        { name: 'title', type: 'text', required: true },
        { name: 'subtitle', type: 'text' },
        { name: 'pcImage', type: 'upload', relationTo: 'media' },
        { name: 'mwImage', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}
