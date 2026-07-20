import type { GlobalConfig } from 'payload'
import { publicRead } from '../access/publicRead'

export const Hero: GlobalConfig = {
  slug: 'hero',
  label: 'Hero (Mở đầu)',
  admin: { group: 'Nội dung trang' },
  access: { read: publicRead },
  fields: [
    { name: 'kvTitle', type: 'text', label: 'Dòng chữ nhỏ phía trên (eyebrow)' },
    { name: 'kvHeadline', type: 'text', label: 'Tiêu đề lớn' },
    { name: 'kvSubheadline', type: 'textarea', label: 'Phụ đề' },
    { name: 'introShort', type: 'text', label: 'Câu giới thiệu ngắn (đoạn giữa)' },
    {
      name: 'introParagraphs',
      type: 'array',
      label: 'Đoạn văn giới thiệu chi tiết',
      labels: { singular: 'Đoạn văn', plural: 'Đoạn văn' },
      fields: [{ name: 'text', type: 'textarea', label: 'Nội dung' }],
    },
    { name: 'pcVideo', type: 'upload', relationTo: 'media', label: 'Video nền (máy tính)' },
    { name: 'mobileVideo', type: 'upload', relationTo: 'media', label: 'Video nền (điện thoại)' },
    { name: 'pcPoster', type: 'upload', relationTo: 'media', label: 'Ảnh chờ video (máy tính)' },
    { name: 'mobilePoster', type: 'upload', relationTo: 'media', label: 'Ảnh chờ video (điện thoại)' },
    { name: 'logo', type: 'upload', relationTo: 'media', label: 'Logo "49th Team" hiện giữa video' },
  ],
}
