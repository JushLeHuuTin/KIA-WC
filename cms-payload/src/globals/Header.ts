import type { GlobalConfig } from 'payload'
import { publicRead } from '../access/publicRead'

// Không có field logo riêng -- dùng chung siteSettings.logo (giống quy ước cũ
// bên Sanity, xem comment trong Header.tsx phía frontend).
export const Header: GlobalConfig = {
  slug: 'header',
  label: 'Header (Menu điều hướng)',
  access: { read: publicRead },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'href', type: 'text', required: true },
      ],
    },
  ],
}
