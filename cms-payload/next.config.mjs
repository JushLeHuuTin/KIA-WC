import path from 'path'
import { fileURLToPath } from 'url'
import { withPayload } from '@payloadcms/next/withPayload'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const payloadConfigAbsPath = path.resolve(dirname, 'src/payload.config.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // "@payload-config" không được withPayload() tự động wiring -- phải khai
  // báo alias tay. Dùng webpack (không phải Turbopack, xem package.json script
  // "--webpack") vì Turbopack trên Windows không resolve nổi alias trỏ path
  // tuyệt đối kiểu Windows ("windows imports are not implemented yet"), và
  // nếu đổi sang file:// URL để né lỗi đó thì lại vỡ ở bước runtime require().
  webpack: (config) => {
    config.resolve.alias['@payload-config'] = payloadConfigAbsPath
    return config
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
