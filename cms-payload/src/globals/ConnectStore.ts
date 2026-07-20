import type { GlobalConfig } from 'payload'
import { publicRead } from '../access/publicRead'

export const ConnectStore: GlobalConfig = {
  slug: 'connect-store',
  label: 'Kết nối cửa hàng',
  access: { read: publicRead },
  fields: [
    { name: 'heading', type: 'textarea', required: true },
    { name: 'body', type: 'textarea' },
    { name: 'buttonTitle', type: 'text', defaultValue: 'Learn more' },
    { name: 'buttonHref', type: 'text' },
    { name: 'pcImage', type: 'upload', relationTo: 'media' },
    { name: 'mwImage', type: 'upload', relationTo: 'media' },
  ],
}
