import type { GlobalConfig } from 'payload'
import { publicRead } from '../access/publicRead'

export const ExperienceCarousel: GlobalConfig = {
  slug: 'experience-carousel',
  label: 'Carousel Trải nghiệm',
  admin: { group: 'Nội dung trang' },
  access: { read: publicRead },
  fields: [
    { name: 'heading', type: 'text', required: true, label: 'Tiêu đề' },
    { name: 'body', type: 'textarea', label: 'Mô tả' },
    {
      name: 'experiences',
      type: 'array',
      label: 'Danh sách trải nghiệm',
      labels: { singular: 'Trải nghiệm', plural: 'Trải nghiệm' },
      minRows: 1,
      fields: [
        { name: 'title', type: 'text', required: true, label: 'Tên' },
        { name: 'description', type: 'textarea', label: 'Mô tả' },
        { name: 'pcImage', type: 'upload', relationTo: 'media', label: 'Ảnh lớn (máy tính)' },
        { name: 'thumbImage', type: 'upload', relationTo: 'media', label: 'Ảnh thumbnail (máy tính)' },
        { name: 'mwImage', type: 'upload', relationTo: 'media', label: 'Ảnh (điện thoại)' },
      ],
    },
  ],
}
