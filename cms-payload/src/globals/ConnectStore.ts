import type { GlobalConfig } from 'payload'
import { publicRead } from '../access/publicRead'

export const ConnectStore: GlobalConfig = {
  slug: 'connect-store',
  label: 'Kết nối cửa hàng',
  admin: { group: 'Nội dung trang' },
  access: { read: publicRead },
  fields: [
    { name: 'heading', type: 'textarea', required: true, label: 'Tiêu đề' },
    { name: 'body', type: 'textarea', label: 'Mô tả' },
    { name: 'buttonTitle', type: 'text', defaultValue: 'Learn more', label: 'Tên nút' },
    { name: 'buttonHref', type: 'text', label: 'Đường dẫn nút' },
    { name: 'pcImage', type: 'upload', relationTo: 'media', label: 'Ảnh (máy tính)' },
    { name: 'mwImage', type: 'upload', relationTo: 'media', label: 'Ảnh (điện thoại)' },
  ],
}
