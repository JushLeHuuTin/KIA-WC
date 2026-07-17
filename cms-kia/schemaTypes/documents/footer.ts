import { defineArrayMember, defineField, defineType } from 'sanity'
import { PanelLeftIcon } from '@sanity/icons/PanelLeft'
import { withAspectRatioWarning } from '../shared/imageAspectRatio'

// Icon mạng xã hội, nút "Family Site"/"Change Region", link điều khoản/chính
// sách (song ngữ Hàn) và dòng bản quyền là UI/pháp lý cố định của Kia -- không
// đưa vào CMS, giống cách xử lý logo/icon ở Header.
export const footer = defineType({
  name: 'footer',
  title: 'Footer',
  type: 'document',
  icon: PanelLeftIcon,
  fields: [
    defineField({ name: 'stayInspiredHeading', title: 'Tiêu đề khối "Stay Inspired"', type: 'string' }),
    defineField({
      name: 'stayInspiredCards',
      title: 'Card "Stay Inspired"',
      type: 'array',
      validation: (rule) => rule.min(1),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'stayInspiredCard',
          fields: [
            defineField({
              name: 'image',
              title: 'Ảnh',
              description: 'Tỉ lệ ngang ~16:9 (vd 464×260px).',
              type: 'image',
              validation: (rule) => withAspectRatioWarning(rule, 464 / 260, '~16:9'),
            }),
            defineField({ name: 'title', title: 'Tiêu đề', type: 'string', validation: (rule) => rule.required() }),
            defineField({ name: 'subtitle', title: 'Tiêu đề phụ', type: 'string' }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'subtitle', media: 'image' },
          },
        }),
      ],
    }),
    defineField({
      name: 'menuColumns',
      title: 'Các cột menu',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'menuColumn',
          fields: [
            defineField({ name: 'title', title: 'Tên cột', type: 'string', validation: (rule) => rule.required() }),
            defineField({
              name: 'items',
              title: 'Các link',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'menuLink',
                  fields: [
                    defineField({ name: 'label', title: 'Tên hiển thị', type: 'string', validation: (rule) => rule.required() }),
                    defineField({ name: 'href', title: 'Đường dẫn', type: 'string', validation: (rule) => rule.required() }),
                  ],
                  preview: {
                    select: { title: 'label', subtitle: 'href' },
                  },
                }),
              ],
            }),
          ],
          preview: {
            select: { title: 'title' },
          },
        }),
      ],
    }),
    defineField({
      name: 'disclaimer1',
      title: 'Disclaimer 1 (tiếng Hàn)',
      description: 'Nội dung miễn trừ trách nhiệm về hình ảnh/thông số xe.',
      type: 'text',
    }),
    defineField({
      name: 'disclaimer2',
      title: 'Disclaimer 2 (tiếng Hàn)',
      description: 'Nội dung miễn trừ trách nhiệm về hình ảnh AI.',
      type: 'text',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Footer' }),
  },
})
