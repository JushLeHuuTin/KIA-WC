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
    {
      // Khoá định danh cố định cho từng vị trí sử dụng trong seed-content.mjs
      // (vd "hero.pcVideo") -- không phải để user điền tay. Cho phép
      // seed-content.mjs xoá đúng các Media do chính nó tạo ra rồi tạo lại từ
      // đầu mỗi lần chạy, mà không đụng tới file admin tự upload qua CMS UI
      // (những file đó không có seedKey).
      name: 'seedKey',
      type: 'text',
      unique: true,
      admin: { hidden: true },
    },
  ],
}
