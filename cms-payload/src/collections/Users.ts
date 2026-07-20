import type { CollectionConfig } from 'payload'

// Đăng nhập admin bằng email + password (Payload tự xử lý). Để mời thêm người
// biên tập: đăng nhập bằng tài khoản đầu tiên (tạo lúc setup lần đầu), vào
// collection Users -> Create New, nhập email họ rồi báo mật khẩu tạm ra ngoài
// (Payload không có luồng "invite qua email" dựng sẵn như Sanity).
export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Người dùng', plural: 'Người dùng' },
  admin: {
    group: 'Quản trị',
    useAsTitle: 'email',
  },
  // Payload không có checkbox "Remember me" dựng sẵn (cần viết lại cả view
  // đăng nhập mới có được) -- dùng cách thực tế tương đương: kéo dài thời
  // gian phiên đăng nhập từ 2 giờ (mặc định) lên 30 ngày, admin không phải
  // đăng nhập lại thường xuyên.
  auth: {
    tokenExpiration: 60 * 60 * 24 * 30, // 30 ngày (giây)
  },
  fields: [],
}
