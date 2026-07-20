import { postgresAdapter } from '@payloadcms/db-postgres'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { vi } from '@payloadcms/translations/languages/vi'
import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { Media } from './collections/Media'
import { Users } from './collections/Users'
import { ConnectStore } from './globals/ConnectStore'
import { ExperienceCarousel } from './globals/ExperienceCarousel'
import { Footer } from './globals/Footer'
import { Header } from './globals/Header'
import { Hero } from './globals/Hero'
import { MainFilmCarousel } from './globals/MainFilmCarousel'
import { Outro } from './globals/Outro'
import { PhaseDetails } from './globals/PhaseDetails'
import { PhaseOverview } from './globals/PhaseOverview'
import { SiteSettings } from './globals/SiteSettings'
import { WatchMore } from './globals/WatchMore'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    components: {
      graphics: {
        // Logo trang đăng nhập (nền sáng) + Icon sidebar (nền tối) -- thay
        // logo mặc định của Payload bằng logo Kia. Đường dẫn dạng
        // "<file>#<export>" được payload generate:importmap quét ra thành
        // import thật, phải chạy lại lệnh đó sau khi thêm/đổi component.
        Logo: '/src/components/KiaLogo#KiaLogo',
        Icon: '/src/components/KiaLogo#KiaIcon',
      },
      // Không còn afterLogin ở đây -- trang /admin/login giờ dùng route riêng
      // (src/app/(payload)/admin/login/page.tsx) với form tự viết, import
      // trực tiếp RememberEmailCheckbox/LoginFooter thay vì qua slot của
      // Payload, để đặt checkbox đúng giữa Password và nút Login (xem
      // CustomLoginForm.tsx).
    },
  },
  // Việt hóa toàn bộ chữ dựng sẵn của Payload (Email, Password, Login, Forgot
  // password?...) -- áp dụng luôn cho CustomLoginForm.tsx vì nó dùng chung
  // hàm t() qua useTranslation() của Payload, không phải tự viết text tay.
  // Chỉ có 1 ngôn ngữ nên Payload tự ẩn nút đổi ngôn ngữ.
  i18n: {
    supportedLanguages: { vi },
    fallbackLanguage: 'vi',
  },
  collections: [Users, Media],
  globals: [
    SiteSettings,
    Hero,
    Header,
    MainFilmCarousel,
    PhaseOverview,
    PhaseDetails,
    WatchMore,
    ExperienceCarousel,
    ConnectStore,
    Outro,
    Footer,
  ],
  // Frontend (KIA-WC-2026) gọi thẳng REST API từ trình duyệt (không qua
  // server-side proxy) nên cần whitelist origin ở đây -- nếu không mọi request
  // vẫn "thành công" khi test bằng curl (curl không áp CORS) nhưng bị trình
  // duyệt chặn im lặng. Thêm domain Vercel thật của frontend vào đây khi
  // deploy xong.
  cors: ['http://localhost:5173', 'https://kia-wc.vercel.app'],
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  plugins: [
    vercelBlobStorage({
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
  ],
})
