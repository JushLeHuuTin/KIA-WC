import { defineField, defineType } from 'sanity'
import { LaunchIcon } from '@sanity/icons/Launch'

export const connectStore = defineType({
  name: 'connectStore',
  title: 'Kết nối cửa hàng',
  type: 'document',
  icon: LaunchIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Tiêu đề',
      type: 'text',
      rows: 2,
      description: 'Xuống dòng thủ công (Enter) tại vị trí muốn ngắt dòng trên giao diện.',
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'body', title: 'Nội dung', type: 'text' }),
    defineField({ name: 'buttonTitle', title: 'Tên nút', type: 'string', initialValue: 'Learn more' }),
    defineField({ name: 'buttonHref', title: 'Đường dẫn nút', type: 'string' }),
    defineField({ name: 'pcImage', title: 'Ảnh Desktop', description: 'Hiển thị theo tỉ lệ ảnh gốc -- khuyến khích ảnh ngang.', type: 'image' }),
    defineField({ name: 'mwImage', title: 'Ảnh Mobile', description: 'Hiển thị theo tỉ lệ ảnh gốc -- khuyến khích ảnh ngang.', type: 'image' }),
  ],
  preview: {
    prepare: () => ({ title: 'Kết nối cửa hàng' }),
  },
})
