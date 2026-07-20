import type { GlobalConfig } from 'payload'
import { publicRead } from '../access/publicRead'

// Dữ liệu dùng chung nhiều section (logo header/footer, social links, SEO
// mặc định) -- không thuộc riêng section nào, xem CLAUDE.md của frontend.
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Cài đặt chung (Site Settings)',
  admin: { group: 'Cài đặt chung' },
  access: { read: publicRead },
  fields: [
    { name: 'logo', type: 'upload', relationTo: 'media', label: 'Logo' },
    {
      name: 'socialLinks',
      type: 'array',
      label: 'Liên kết mạng xã hội',
      labels: { singular: 'Liên kết', plural: 'Liên kết' },
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          label: 'Nền tảng',
          options: ['Instagram', 'Facebook', 'LinkedIn', 'X', 'YouTube'],
        },
        { name: 'href', type: 'text', required: true, label: 'Đường dẫn (URL)' },
      ],
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      fields: [
        { name: 'title', type: 'text', label: 'Tiêu đề SEO' },
        { name: 'description', type: 'textarea', label: 'Mô tả SEO' },
        { name: 'ogImage', type: 'upload', relationTo: 'media', label: 'Ảnh chia sẻ (OG Image)' },
      ],
    },
  ],
}
