import type { GlobalConfig } from 'payload'
import { publicRead } from '../access/publicRead'

// phases[].items[] là 2 cấp array-of-object lồng nhau -- Payload hỗ trợ trực
// tiếp (array field có thể chứa array field con), không cần xử lý gì đặc biệt.
export const PhaseDetails: GlobalConfig = {
  slug: 'phase-details',
  label: 'Chi tiết các Phase',
  access: { read: publicRead },
  fields: [
    {
      name: 'phases',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'anchorId', type: 'text', required: true },
        { name: 'eyebrow', type: 'text', required: true },
        { name: 'headline', type: 'text', required: true },
        { name: 'body', type: 'textarea' },
        { name: 'bgPc', type: 'upload', relationTo: 'media' },
        { name: 'bgMw', type: 'upload', relationTo: 'media' },
        {
          name: 'items',
          type: 'array',
          minRows: 1,
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'description', type: 'textarea' },
            { name: 'videoId', type: 'text' },
            { name: 'pcImage', type: 'upload', relationTo: 'media' },
            { name: 'mwImage', type: 'upload', relationTo: 'media' },
          ],
        },
      ],
    },
  ],
}
