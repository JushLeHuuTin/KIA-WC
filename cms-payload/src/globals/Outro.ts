import type { GlobalConfig } from 'payload'
import { publicRead } from '../access/publicRead'

export const Outro: GlobalConfig = {
  slug: 'outro',
  label: 'Outro (Kết thúc)',
  admin: { group: 'Nội dung trang' },
  access: { read: publicRead },
  fields: [
    {
      name: 'paragraphs',
      type: 'array',
      label: 'Đoạn văn',
      labels: { singular: 'Đoạn văn', plural: 'Đoạn văn' },
      minRows: 1,
      fields: [
        { name: 'text', type: 'textarea', required: true, label: 'Nội dung' },
        { name: 'bold', type: 'checkbox', defaultValue: false, label: 'In đậm' },
      ],
    },
    { name: 'pcImage', type: 'upload', relationTo: 'media', label: 'Ảnh nền (máy tính)' },
    { name: 'mwImage', type: 'upload', relationTo: 'media', label: 'Ảnh nền (điện thoại)' },
  ],
}
