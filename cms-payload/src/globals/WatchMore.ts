import type { GlobalConfig } from 'payload'
import { publicRead } from '../access/publicRead'

export const WatchMore: GlobalConfig = {
  slug: 'watch-more',
  label: 'Nút xem thêm video',
  access: { read: publicRead },
  fields: [
    { name: 'heading', type: 'textarea', required: true },
    { name: 'body', type: 'textarea' },
    { name: 'buttonTitle', type: 'text' },
    { name: 'buttonSubtitle', type: 'textarea' },
    { name: 'buttonHref', type: 'text' },
    { name: 'pcImage', type: 'upload', relationTo: 'media' },
    { name: 'mwImage', type: 'upload', relationTo: 'media' },
  ],
}
