import { defineArrayMember, defineField, defineType } from 'sanity'
import { CogIcon } from '@sanity/icons/Cog'
import { ShareIcon } from '@sanity/icons/Share'

// Dữ liệu dùng chung ở nhiều nơi trên site (khác với các document còn lại, mỗi
// cái chỉ thuộc về đúng 1 section) -- vd logo Kia xuất hiện ở cả Header lẫn
// Footer, social links có thể tái sử dụng ở nhiều chỗ trong tương lai.
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Cài đặt chung (Site Settings)',
  type: 'document',
  icon: CogIcon,
  groups: [
    { name: 'general', title: 'Chung' },
    { name: 'social', title: 'Mạng xã hội' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({ name: 'logo', title: 'Logo Kia', type: 'image', group: 'general' }),
    defineField({
      name: 'socialLinks',
      title: 'Link mạng xã hội',
      description: 'Chỉ cần điền đường dẫn -- icon hiển thị được map sẵn theo tên nền tảng.',
      type: 'array',
      group: 'social',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'socialLink',
          icon: ShareIcon,
          fields: [
            defineField({
              name: 'platform',
              title: 'Nền tảng',
              type: 'string',
              options: {
                list: ['Instagram', 'Facebook', 'LinkedIn', 'X', 'YouTube'],
                layout: 'radio',
              },
              validation: (rule) => rule.required(),
            }),
            defineField({ name: 'href', title: 'Đường dẫn', type: 'string', validation: (rule) => rule.required() }),
          ],
          preview: {
            select: { title: 'platform', subtitle: 'href' },
          },
        }),
      ],
    }),
    defineField({
      name: 'seo',
      title: 'SEO mặc định',
      type: 'object',
      group: 'seo',
      fields: [
        defineField({ name: 'title', title: 'Tiêu đề trang (thẻ title)', type: 'string' }),
        defineField({ name: 'description', title: 'Mô tả (meta description)', type: 'text' }),
        defineField({ name: 'ogImage', title: 'Ảnh chia sẻ (Open Graph)', type: 'image' }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Cài đặt chung (Site Settings)' }),
  },
})
