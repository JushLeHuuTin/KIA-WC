import { defineArrayMember, defineField, defineType } from 'sanity'
import { PlayIcon } from '@sanity/icons/Play'
import { ImageIcon } from '@sanity/icons/Image'
import { TextIcon } from '@sanity/icons/Text'
import { VideoIcon } from '@sanity/icons/Video'
import { YouTubeIdInput } from '../../components/YouTubeIdInput'
import { withAspectRatioWarning } from '../shared/imageAspectRatio'

export const mainFilmCarousel = defineType({
  name: 'mainFilmCarousel',
  title: 'Carousel phim chính',
  type: 'document',
  icon: PlayIcon,
  fields: [
    defineField({
      name: 'films',
      title: 'Danh sách phim',
      type: 'array',
      validation: (rule) => rule.min(1),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'film',
          icon: VideoIcon,
          groups: [
            { name: 'content', title: 'Nội dung', icon: TextIcon, default: true },
            { name: 'media', title: 'Hình ảnh', icon: ImageIcon },
          ],
          fields: [
            defineField({ name: 'title', title: 'Tiêu đề', type: 'string', validation: (rule) => rule.required(), group: 'content' }),
            defineField({
              name: 'videoId',
              title: 'YouTube Video ID',
              description: 'Dán cả URL YouTube (watch?v=, youtu.be/, shorts/...) hoặc chỉ ID -- tự động tách ID.',
              type: 'string',
              validation: (rule) => rule.required(),
              group: 'content',
              components: { input: YouTubeIdInput },
            }),
            defineField({
              name: 'pcThumbnail',
              title: 'Ảnh thumbnail Desktop',
              description: 'Tỉ lệ ngang ~2:1 (vd 1318×642px).',
              type: 'image',
              group: 'media',
              validation: (rule) => withAspectRatioWarning(rule, 1318 / 642, '~2:1'),
            }),
            defineField({
              name: 'mwThumbnail',
              title: 'Ảnh thumbnail Mobile',
              description: 'Tỉ lệ dọc 3:4 (vd 300×400px).',
              type: 'image',
              group: 'media',
              validation: (rule) => withAspectRatioWarning(rule, 300 / 400, '3:4'),
            }),
          ],
          preview: {
            select: { title: 'title', media: 'pcThumbnail' },
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Carousel phim chính' }),
  },
})
