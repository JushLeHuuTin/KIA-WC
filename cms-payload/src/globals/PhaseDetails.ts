import type { GlobalConfig } from 'payload'
import { publicRead } from '../access/publicRead'

// phases[].items[] là 2 cấp array-of-object lồng nhau -- Payload hỗ trợ trực
// tiếp (array field có thể chứa array field con), không cần xử lý gì đặc biệt.
export const PhaseDetails: GlobalConfig = {
  slug: 'phase-details',
  label: 'Chi tiết các Phase',
  admin: { group: 'Nội dung trang' },
  access: { read: publicRead },
  fields: [
    {
      name: 'phases',
      type: 'array',
      label: 'Danh sách Phase',
      labels: { singular: 'Phase', plural: 'Phase' },
      minRows: 1,
      // Không có field anchorId nhập tay -- ID neo được sinh tự động theo VỊ
      // TRÍ (phase thứ 1 -> "phase-1"...), khớp với global `phase-overview`
      // cũng tự sinh id y hệt theo vị trí, đảm bảo nút "Go to section" ở
      // phase-overview luôn nhảy đúng tới section này.
      fields: [
        { name: 'eyebrow', type: 'text', required: true, label: 'Dòng chữ nhỏ (ví dụ: Phase 1: The Calling)' },
        { name: 'headline', type: 'text', required: true, label: 'Tiêu đề' },
        { name: 'body', type: 'textarea', label: 'Mô tả' },
        { name: 'bgPc', type: 'upload', relationTo: 'media', label: 'Ảnh nền (máy tính)' },
        { name: 'bgMw', type: 'upload', relationTo: 'media', label: 'Ảnh nền (điện thoại)' },
        {
          name: 'items',
          type: 'array',
          label: 'Video con của Phase này',
          labels: { singular: 'Video', plural: 'Video' },
          minRows: 1,
          fields: [
            { name: 'title', type: 'text', required: true, label: 'Tên video' },
            { name: 'description', type: 'textarea', label: 'Mô tả' },
            { name: 'videoId', type: 'text', label: 'ID video YouTube' },
            { name: 'pcImage', type: 'upload', relationTo: 'media', label: 'Ảnh (máy tính)' },
            { name: 'mwImage', type: 'upload', relationTo: 'media', label: 'Ảnh (điện thoại)' },
          ],
        },
      ],
    },
  ],
}
