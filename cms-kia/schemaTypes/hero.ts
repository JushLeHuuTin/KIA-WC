import { defineField, defineType } from 'sanity'

export const hero = defineType({
  name: 'hero',
  title: 'Hero Section',
  type: 'document',
  fields: [
    // Nội dung text
    defineField({ name: 'kvTitle', title: 'KV Title', type: 'string' }),
    defineField({ name: 'kvHeadline', title: 'KV Headline', type: 'string' }),
    defineField({ name: 'kvSubheadline', title: 'KV Subheadline', type: 'text' }),
    defineField({ name: 'introShort', title: 'Intro Short Text', type: 'string' }),
    defineField({ 
      name: 'introParagraphs', 
      title: 'Intro Paragraphs', 
      type: 'array', 
      of: [{ type: 'text' }] 
    }),
    
    // Hình ảnh & Video (Đầy đủ)
    defineField({ name: 'pcVideo', title: 'Desktop Video (MP4)', type: 'file' }),
    defineField({ name: 'mobileVideo', title: 'Mobile Video (MP4)', type: 'file' }),
    defineField({ name: 'pcPoster', title: 'Desktop Poster Image', type: 'image' }),
    defineField({ name: 'mobilePoster', title: 'Mobile Poster Image', type: 'image' }),
    defineField({ name: 'logo', title: '49th Team Logo', type: 'image' }),
  ],
})