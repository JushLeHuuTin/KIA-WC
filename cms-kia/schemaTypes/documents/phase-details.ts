import { defineArrayMember, defineField, defineType } from 'sanity'
import { OlistIcon } from '@sanity/icons/Olist'
import { ImageIcon } from '@sanity/icons/Image'
import { PlayIcon } from '@sanity/icons/Play'
import { TextIcon } from '@sanity/icons/Text'
import { DocumentTextIcon } from '@sanity/icons/DocumentText'
import { YouTubeIdInput } from '../../components/YouTubeIdInput'
import { withAspectRatioWarning } from '../shared/imageAspectRatio'

export const phaseDetails = defineType({
  name: 'phaseDetails',
  title: 'Chi tiết các Phase',
  type: 'document',
  icon: OlistIcon,
  fields: [
    defineField({
      name: 'phases',
      title: 'Danh sách Phase',
      type: 'array',
      validation: (rule) => rule.min(1),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'phaseDetail',
          icon: DocumentTextIcon,
          // Tách 2 tab "Nội dung" / "Hình ảnh nền" cho gọn -- object này có tới
          // 6 field phẳng + 1 mảng con, để chung 1 form dài sẽ rối.
          groups: [
            { name: 'content', title: 'Nội dung', icon: TextIcon, default: true },
            { name: 'media', title: 'Hình ảnh nền', icon: ImageIcon },
          ],
          fields: [
            defineField({
              name: 'anchorId',
              title: 'Anchor ID',
              description: 'Phải khớp với anchorId của phase tương ứng ở Phase Overview (vd: phase-1).',
              type: 'string',
              validation: (rule) => rule.required(),
              group: 'content',
            }),
            defineField({ name: 'eyebrow', title: 'Dòng nhỏ phía trên (vd: Phase 1: The Calling)', type: 'string', validation: (rule) => rule.required(), group: 'content' }),
            defineField({ name: 'headline', title: 'Tiêu đề chính', type: 'string', validation: (rule) => rule.required(), group: 'content' }),
            defineField({ name: 'body', title: 'Nội dung', type: 'text', group: 'content' }),
            defineField({ name: 'bgPc', title: 'Ảnh nền Desktop', description: 'Ảnh phủ toàn bộ card -- nên chọn ảnh có bố cục trung tâm, không có chữ/chi tiết quan trọng sát viền.', type: 'image', group: 'media' }),
            defineField({ name: 'bgMw', title: 'Ảnh nền Mobile', description: 'Ảnh phủ toàn bộ card -- nên chọn ảnh có bố cục trung tâm, không có chữ/chi tiết quan trọng sát viền.', type: 'image', group: 'media' }),
            defineField({
              name: 'items',
              title: 'Danh sách video',
              type: 'array',
              validation: (rule) => rule.min(1),
              group: 'content',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'phaseVideoItem',
                  icon: PlayIcon,
                  groups: [
                    { name: 'content', title: 'Nội dung', icon: TextIcon, default: true },
                    { name: 'media', title: 'Hình ảnh / Video', icon: ImageIcon },
                  ],
                  fields: [
                    defineField({ name: 'title', title: 'Tiêu đề', type: 'string', validation: (rule) => rule.required(), group: 'content' }),
                    defineField({ name: 'description', title: 'Mô tả', type: 'text', group: 'content' }),
                    defineField({
                      name: 'videoId',
                      title: 'YouTube Video ID',
                      description: 'Dán cả URL YouTube (watch?v=, youtu.be/, shorts/...) hoặc chỉ ID -- tự động tách ID.',
                      type: 'string',
                      group: 'media',
                      components: { input: YouTubeIdInput },
                    }),
                    defineField({
                      name: 'pcImage',
                      title: 'Ảnh thumbnail Desktop',
                      description: 'Tỉ lệ ngang ~16:9.',
                      type: 'image',
                      group: 'media',
                      validation: (rule) => withAspectRatioWarning(rule, 16 / 9, '16:9 (ngang)'),
                    }),
                    defineField({
                      name: 'mwImage',
                      title: 'Ảnh thumbnail Mobile',
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
            select: { title: 'headline', subtitle: 'eyebrow', media: 'bgPc' },
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Chi tiết các Phase' }),
  },
})
