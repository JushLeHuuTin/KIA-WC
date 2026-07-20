import type { GlobalConfig } from 'payload'
import { publicRead } from '../access/publicRead'

// menuColumns[].items[] là cấp lồng 2 array-of-object thứ 2 (cùng kiểu với
// phaseDetails.phases[].items[]). Icon mạng xã hội, nút "Family Site"/"Change
// Region", link điều khoản, dòng bản quyền là UI cố định phía frontend, không
// có field tương ứng ở đây (giữ đúng quy ước cũ bên Sanity).
export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Footer',
  admin: { group: 'Nội dung trang' },
  access: { read: publicRead },
  fields: [
    { name: 'stayInspiredHeading', type: 'text', label: 'Tiêu đề "Stay Inspired"' },
    {
      name: 'stayInspiredCards',
      type: 'array',
      label: 'Thẻ "Stay Inspired"',
      labels: { singular: 'Thẻ', plural: 'Thẻ' },
      minRows: 1,
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', label: 'Ảnh' },
        { name: 'title', type: 'text', required: true, label: 'Tiêu đề' },
        { name: 'subtitle', type: 'text', label: 'Phụ đề' },
      ],
    },
    {
      name: 'menuColumns',
      type: 'array',
      label: 'Cột menu footer',
      labels: { singular: 'Cột menu', plural: 'Cột menu' },
      fields: [
        { name: 'title', type: 'text', required: true, label: 'Tên cột' },
        {
          name: 'items',
          type: 'array',
          label: 'Liên kết trong cột',
          labels: { singular: 'Liên kết', plural: 'Liên kết' },
          fields: [
            { name: 'label', type: 'text', required: true, label: 'Tên hiển thị' },
            { name: 'href', type: 'text', required: true, label: 'Đường dẫn' },
          ],
        },
      ],
    },
    { name: 'disclaimer1', type: 'textarea', label: 'Dòng miễn trừ trách nhiệm 1' },
    { name: 'disclaimer2', type: 'textarea', label: 'Dòng miễn trừ trách nhiệm 2' },
  ],
}
