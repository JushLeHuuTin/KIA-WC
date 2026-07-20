import type { GlobalConfig } from 'payload'
import { publicRead } from '../access/publicRead'

// menuColumns[].items[] là cấp lồng 2 array-of-object thứ 2 (cùng kiểu với
// phaseDetails.phases[].items[]). Icon mạng xã hội, nút "Family Site"/"Change
// Region", link điều khoản, dòng bản quyền là UI cố định phía frontend, không
// có field tương ứng ở đây (giữ đúng quy ước cũ bên Sanity).
export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Footer',
  access: { read: publicRead },
  fields: [
    { name: 'stayInspiredHeading', type: 'text' },
    {
      name: 'stayInspiredCards',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media' },
        { name: 'title', type: 'text', required: true },
        { name: 'subtitle', type: 'text' },
      ],
    },
    {
      name: 'menuColumns',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', required: true },
        {
          name: 'items',
          type: 'array',
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'href', type: 'text', required: true },
          ],
        },
      ],
    },
    { name: 'disclaimer1', type: 'textarea' },
    { name: 'disclaimer2', type: 'textarea' },
  ],
}
