import { defineArrayMember, defineField, defineType } from 'sanity'
import { ImagesIcon } from '@sanity/icons/Images'
import { ImageIcon } from '@sanity/icons/Image'
import { TextIcon } from '@sanity/icons/Text'
import { withAspectRatioWarning } from '../shared/imageAspectRatio'

export const experienceCarousel = defineType({
  name: 'experienceCarousel',
  title: 'Carousel Trải nghiệm',
  type: 'document',
  icon: ImagesIcon,
  fields: [
    defineField({ name: 'heading', title: 'Tiêu đề', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'body', title: 'Nội dung', type: 'text' }),
    defineField({
      name: 'experiences',
      title: 'Danh sách trải nghiệm',
      type: 'array',
      validation: (rule) => rule.min(1),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'experience',
          groups: [
            { name: 'content', title: 'Nội dung', icon: TextIcon, default: true },
            { name: 'media', title: 'Hình ảnh', icon: ImageIcon },
          ],
          fields: [
            defineField({ name: 'title', title: 'Tiêu đề', type: 'string', validation: (rule) => rule.required(), group: 'content' }),
            defineField({ name: 'description', title: 'Mô tả', type: 'text', group: 'content' }),
            defineField({
              name: 'pcImage',
              title: 'Ảnh Desktop',
              description: 'Tỉ lệ 4:3, ảnh chính hiển thị khi item đang active.',
              type: 'image',
              group: 'media',
              validation: (rule) => withAspectRatioWarning(rule, 4 / 3, '4:3'),
            }),
            defineField({
              name: 'thumbImage',
              title: 'Ảnh thumbnail',
              description: 'Tỉ lệ vuông 1:1 -- ảnh nhỏ trong dãy thumbnail.',
              type: 'image',
              group: 'media',
              validation: (rule) => withAspectRatioWarning(rule, 1, '1:1 (vuông)'),
            }),
            defineField({
              name: 'mwImage',
              title: 'Ảnh Mobile',
              description: 'Tỉ lệ vuông 1:1.',
              type: 'image',
              group: 'media',
              validation: (rule) => withAspectRatioWarning(rule, 1, '1:1 (vuông)'),
            }),
          ],
          preview: {
            select: { title: 'title', media: 'pcImage' },
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Carousel Trải nghiệm' }),
  },
})
