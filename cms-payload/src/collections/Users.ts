import type { CollectionConfig } from 'payload'

// Đăng nhập admin bằng email + password (Payload tự xử lý). Để mời thêm người
// biên tập: đăng nhập bằng tài khoản đầu tiên (tạo lúc setup lần đầu), vào
// collection Users -> Create New, nhập email họ rồi báo mật khẩu tạm ra ngoài
// (Payload không có luồng "invite qua email" dựng sẵn như Sanity).
export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  fields: [],
}
