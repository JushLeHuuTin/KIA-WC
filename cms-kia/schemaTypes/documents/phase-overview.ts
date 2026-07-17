import { defineArrayMember, defineField, defineType } from 'sanity'
import { ThLargeIcon } from '@sanity/icons/ThLarge'
import { ImageIcon } from '@sanity/icons/Image'
import { TextIcon } from '@sanity/icons/Text'
import { TagIcon } from '@sanity/icons/Tag'
import { withAspectRatioWarning } from '../shared/imageAspectRatio'

export const phaseOverview = defineType({
  name: 'phaseOverview',
  title: 'Tổng quan các Phase',
  type: 'document',
  icon: ThLargeIcon,
  fields: [
    defineField({ name: 'heading', title: 'Tiêu đề', type: 'string' }),
    defineField({
      name: 'bodyParagraphs',
      title: 'Các đoạn nội dung',
      type: 'array',
      of: [{ type: 'text' }],
    }),
    defineField({
      name: 'phases',
      title: 'Danh sách Phase',
      type: 'array',
      validation: (rule) => rule.min(1),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'phase',
          icon: TagIcon,
          groups: [
            { name: 'content', title: 'Nội dung', icon: TextIcon, default: true },
            { name: 'media', title: 'Hình ảnh', icon: ImageIcon },
          ],
          fields: [
            defineField({
              name: 'anchorId',
              title: 'Anchor ID',
              description: 'Phải khớp với anchor id ở Phase Details tương ứng (vd: phase-1) để nút "Go to section" cuộn đúng chỗ.',
              type: 'string',
              validation: (rule) => rule.required(),
              group: 'content',
            }),
            defineField({ name: 'label', title: 'Nhãn (vd: Phase 1)', type: 'string', validation: (rule) => rule.required(), group: 'content' }),
            defineField({ name: 'title', title: 'Tiêu đề', type: 'string', validation: (rule) => rule.required(), group: 'content' }),
            defineField({ name: 'subtitle', title: 'Tiêu đề phụ', type: 'string', group: 'content' }),
            defineField({
              name: 'pcImage',
              title: 'Ảnh Desktop',
              description: 'Tỉ lệ dọc 3:4 (vd 342×456px) -- ảnh thẻ card.',
              type: 'image',
              group: 'media',
              validation: (rule) => withAspectRatioWarning(rule, 342 / 456, '3:4 (dọc)'),
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
            select: { title: 'title', subtitle: 'label', media: 'pcImage' },
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Tổng quan các Phase' }),
  },
})
