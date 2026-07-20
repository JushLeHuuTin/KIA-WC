import type { GlobalConfig } from 'payload'
import { publicRead } from '../access/publicRead'

export const PhaseOverview: GlobalConfig = {
  slug: 'phase-overview',
  label: 'Tổng quan các Phase',
  admin: { group: 'Nội dung trang' },
  access: { read: publicRead },
  fields: [
    { name: 'heading', type: 'text', label: 'Tiêu đề' },
    {
      name: 'bodyParagraphs',
      type: 'array',
      label: 'Đoạn văn giới thiệu',
      labels: { singular: 'Đoạn văn', plural: 'Đoạn văn' },
      fields: [{ name: 'text', type: 'textarea', label: 'Nội dung' }],
    },
    {
      name: 'phases',
      type: 'array',
      label: 'Danh sách Phase',
      labels: { singular: 'Phase', plural: 'Phase' },
      minRows: 1,
      // Không có field anchorId nhập tay -- ID neo để nút "Go to section" nhảy
      // đúng chỗ được sinh tự động theo VỊ TRÍ (phase thứ 1 -> "phase-1"...),
      // khớp với cách global `phase-details` cũng tự sinh id y hệt theo vị trí.
      // Trước đây cả 2 bên đều có ô anchorId tự nhập riêng -- dễ gõ sai/lệch
      // nhau giữa 2 Global độc lập, làm nút "Go to section" im lặng không nhảy.
      fields: [
        { name: 'label', type: 'text', required: true, label: 'Nhãn (ví dụ: Phase 1)' },
        { name: 'title', type: 'text', required: true, label: 'Tên Phase' },
        { name: 'subtitle', type: 'text', label: 'Phụ đề' },
        { name: 'pcImage', type: 'upload', relationTo: 'media', label: 'Ảnh (máy tính)' },
        { name: 'mwImage', type: 'upload', relationTo: 'media', label: 'Ảnh (điện thoại)' },
      ],
    },
  ],
}
