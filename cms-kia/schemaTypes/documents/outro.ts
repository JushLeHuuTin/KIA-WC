import { defineArrayMember, defineField, defineType } from 'sanity'
import { RocketIcon } from '@sanity/icons/Rocket'

export const outro = defineType({
  name: 'outro',
  title: 'Outro (Kết thúc)',
  type: 'document',
  icon: RocketIcon,
  fields: [
    defineField({
      name: 'paragraphs',
      title: 'Các đoạn văn',
      description: 'Xuất hiện tuần tự, fade-in từng đoạn theo thứ tự trong danh sách.',
      type: 'array',
      validation: (rule) => rule.min(1),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'paragraph',
          fields: [
            defineField({ name: 'text', title: 'Nội dung', type: 'text', validation: (rule) => rule.required() }),
            defineField({ name: 'bold', title: 'In đậm', type: 'boolean', initialValue: false }),
          ],
          preview: {
            select: { title: 'text' },
          },
        }),
      ],
    }),
    defineField({ name: 'pcImage', title: 'Ảnh Desktop', description: 'Ảnh nền cao gần hết màn hình -- nên chọn ảnh dọc/vuông, chủ thể ở giữa hoặc bên phải (chữ nằm bên trái).', type: 'image' }),
    defineField({ name: 'mwImage', title: 'Ảnh Mobile', description: 'Ảnh nền cao gần hết màn hình -- nên chọn ảnh dọc, chủ thể ở giữa hoặc bên phải (chữ nằm bên trái).', type: 'image' }),
  ],
  preview: {
    prepare: () => ({ title: 'Outro (Kết thúc)' }),
  },
})
