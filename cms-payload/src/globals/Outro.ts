import type { GlobalConfig } from 'payload'
import { publicRead } from '../access/publicRead'

export const Outro: GlobalConfig = {
  slug: 'outro',
  label: 'Outro (Kết thúc)',
  access: { read: publicRead },
  fields: [
    {
      name: 'paragraphs',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'text', type: 'textarea', required: true },
        { name: 'bold', type: 'checkbox', defaultValue: false },
      ],
    },
    { name: 'pcImage', type: 'upload', relationTo: 'media' },
    { name: 'mwImage', type: 'upload', relationTo: 'media' },
  ],
}
