import type { Access } from 'payload'

// Đọc công khai, không cần token -- tương đương dataset "production" public-read
// của Sanity trước đây. Ghi/sửa vẫn yêu cầu đăng nhập (mặc định của Payload,
// không override create/update/delete).
export const publicRead: Access = () => true
