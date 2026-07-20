import type { GlobalConfig } from 'payload'
import { publicRead } from '../access/publicRead'

export const WatchMore: GlobalConfig = {
  slug: 'watch-more',
  label: 'Nút xem thêm video',
  admin: { group: 'Nội dung trang' },
  access: { read: publicRead },
  fields: [
    { name: 'heading', type: 'textarea', required: true, label: 'Tiêu đề' },
    { name: 'body', type: 'textarea', label: 'Mô tả' },
    { name: 'buttonTitle', type: 'text', label: 'Tên nút' },
    { name: 'buttonSubtitle', type: 'textarea', label: 'Phụ đề nút' },
    { name: 'buttonHref', type: 'text', label: 'Đường dẫn nút' },
    { name: 'pcImage', type: 'upload', relationTo: 'media', label: 'Ảnh nền (máy tính)' },
    { name: 'mwImage', type: 'upload', relationTo: 'media', label: 'Ảnh nền (điện thoại)' },
  ],
}
