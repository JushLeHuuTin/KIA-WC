import { defineArrayMember, defineField, defineType } from 'sanity'
import { MenuIcon } from '@sanity/icons/Menu'
import { LinkIcon } from '@sanity/icons/Link'

export const header = defineType({
  name: 'header',
  title: 'Header (Menu điều hướng)',
  type: 'document',
  icon: MenuIcon,
  // Logo Kia dùng chung cho cả Header lẫn Footer -- quản lý tập trung ở
  // Site Settings, không lặp lại field logo riêng ở đây.
  fields: [
    defineField({
      name: 'navItems',
      title: 'Các mục menu',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'navItem',
          icon: LinkIcon,
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
    prepare: () => ({ title: 'Header (Menu điều hướng)' }),
  },
})
