import type { GlobalConfig } from 'payload'
import { publicRead } from '../access/publicRead'

// Dữ liệu dùng chung nhiều section (logo header/footer, social links, SEO
// mặc định) -- không thuộc riêng section nào, xem CLAUDE.md của frontend.
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Cài đặt chung (Site Settings)',
  access: { read: publicRead },
  fields: [
    { name: 'logo', type: 'upload', relationTo: 'media' },
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: ['Instagram', 'Facebook', 'LinkedIn', 'X', 'YouTube'],
        },
        { name: 'href', type: 'text', required: true },
      ],
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
        { name: 'ogImage', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}
