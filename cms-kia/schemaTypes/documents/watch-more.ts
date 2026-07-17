import { defineField, defineType } from 'sanity'
import { EnterRightIcon } from '@sanity/icons/EnterRight'

export const watchMore = defineType({
  name: 'watchMore',
  title: 'Nút xem thêm video',
  type: 'document',
  icon: EnterRightIcon,
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
    defineField({ name: 'buttonTitle', title: 'Tên nút', type: 'string', placeholder: 'Watch more OMBC videos' }),
    defineField({ name: 'buttonSubtitle', title: 'Mô tả phụ trong nút', type: 'text' }),
    defineField({ name: 'buttonHref', title: 'Đường dẫn nút', type: 'string', placeholder: '/videos' }),
    defineField({ name: 'pcImage', title: 'Ảnh nền Desktop', description: 'Ảnh phủ toàn màn hình -- ưu tiên ảnh ngang, độ phân giải cao.', type: 'image' }),
    defineField({ name: 'mwImage', title: 'Ảnh nền Mobile', description: 'Ảnh phủ toàn màn hình -- ưu tiên ảnh dọc, độ phân giải cao.', type: 'image' }),
  ],
  preview: {
    prepare: () => ({ title: 'Nút xem thêm video' }),
  },
})
