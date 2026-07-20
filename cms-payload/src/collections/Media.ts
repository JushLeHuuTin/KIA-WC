import type { CollectionConfig } from 'payload'
import { publicRead } from '../access/publicRead'

// 1 collection dùng chung cho toàn bộ ảnh (22 field image) lẫn 2 video hero
// (mp4) -- không cần tách collection riêng cho video, upload field chỉ cần
// allow đúng mimeTypes. Lưu trữ thật sự (Vercel Blob) được cấu hình qua plugin
// vercelBlobStorage trong payload.config.ts, không phải ở đây.
export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Ảnh/Video', plural: 'Ảnh/Video' },
  admin: { group: 'Quản trị' },
  access: {
    read: publicRead,
  },
  upload: {
    mimeTypes: ['image/*', 'video/mp4'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Mô tả ảnh (alt text)',
    },
  ],
}
