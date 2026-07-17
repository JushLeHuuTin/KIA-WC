import { defineField, defineType } from 'sanity'
import { ExpandIcon } from '@sanity/icons/Expand'

export const hero = defineType({
  name: 'hero',
  title: 'Hero (Mở đầu)',
  type: 'document',
  icon: ExpandIcon,
  fields: [
    // Nội dung text
    defineField({ name: 'kvTitle', title: 'Dòng mở đầu (KV Title)', type: 'string', placeholder: 'FIFA Official Match Ball Carrier' }),
    defineField({ name: 'kvHeadline', title: 'Tiêu đề chính', type: 'string', placeholder: 'Where Young Dreams Move Forward' }),
    defineField({ name: 'kvSubheadline', title: 'Tiêu đề phụ', type: 'text' }),
    defineField({ name: 'introShort', title: 'Câu mở đầu đoạn giới thiệu', type: 'string' }),
    defineField({
      name: 'introParagraphs',
      title: 'Các dòng đoạn giới thiệu',
      description: 'Mỗi dòng là 1 phần tử trong danh sách, hiển thị nối tiếp nhau.',
      type: 'array',
      of: [{ type: 'text' }],
    }),

    // Hình ảnh & Video
    defineField({ name: 'pcVideo', title: 'Video Desktop (MP4)', type: 'file' }),
    defineField({ name: 'mobileVideo', title: 'Video Mobile (MP4)', type: 'file' }),
    defineField({ name: 'pcPoster', title: 'Ảnh poster Desktop', description: 'Hiện tạm trước khi video tải xong -- nên là khung hình đầu của video, tỉ lệ ngang.', type: 'image' }),
    defineField({ name: 'mobilePoster', title: 'Ảnh poster Mobile', description: 'Hiện tạm trước khi video tải xong -- nên là khung hình đầu của video, tỉ lệ dọc.', type: 'image' }),
    defineField({ name: 'logo', title: 'Logo 49th Team', type: 'image' }),
  ],
  preview: {
    prepare: () => ({ title: 'Hero (Mở đầu)' }),
  },
})
