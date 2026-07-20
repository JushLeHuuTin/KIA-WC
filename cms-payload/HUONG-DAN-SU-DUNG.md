# Hướng dẫn sử dụng CMS — Trang Kia FIFA World Cup 2026 (OMBC)

Tài liệu này dành cho người **chỉnh sửa nội dung** (content editor), không cần biết
lập trình. Mọi thay đổi ở đây sẽ tự động cập nhật lên website sau vài giây.

## 1. Đăng nhập

Truy cập: `<địa chỉ Studio>/admin` (địa chỉ cụ thể sẽ được gửi riêng sau khi
deploy xong).

- Lần đầu tiên truy cập, hệ thống sẽ yêu cầu **tạo tài khoản admin đầu tiên**
  (nhập email + mật khẩu). Đây là tài khoản chính, dùng để mời thêm người khác
  sau này.
- Những lần sau chỉ cần đăng nhập bằng email + mật khẩu đã tạo.

### Mời thêm người cùng chỉnh sửa

Vào menu bên trái → **Users** → **Create New** → nhập email người đó → đặt mật
khẩu tạm rồi báo cho họ qua kênh riêng (Zalo/email) để họ tự đổi mật khẩu sau
khi đăng nhập lần đầu.

## 2. Cấu trúc trang — mỗi mục tương ứng 1 phần trên website

Menu bên trái liệt kê đúng theo thứ tự xuất hiện trên trang, từ trên xuống dưới:

| Tên trong CMS | Phần tương ứng trên website |
|---|---|
| **Cài đặt chung (Site Settings)** | Logo Kia, link mạng xã hội (Instagram/Facebook/...), tiêu đề SEO khi chia sẻ link |
| **Header (Menu điều hướng)** | Các mục menu ngang trên cùng (Thương hiệu, Thiết kế, Sản phẩm...) |
| **Hero (Mở đầu)** | Phần mở đầu có video nền, tiêu đề lớn "Where Young Dreams Move Forward" |
| **Carousel phim chính** | Dải phim ngang cuộn ngang, mỗi phim có tiêu đề + video YouTube |
| **Tổng quan các Phase** | 4 thẻ giới thiệu Phase 1-4 |
| **Chi tiết các Phase** | Nội dung chi tiết từng Phase (ảnh nền, tiêu đề, mô tả, danh sách video con) |
| **Nút xem thêm video** | Khối "Watch more OMBC videos" |
| **Carousel Trải nghiệm** | Dải trải nghiệm cuộn ngang có nhiều ảnh/mô tả |
| **Kết nối cửa hàng** | Khối kêu gọi hành động gần cuối trang |
| **Outro (Kết thúc)** | Đoạn văn bản kết thúc cuối trang |
| **Footer** | "Stay Inspired" + các cột menu + dòng miễn trừ trách nhiệm cuối trang |

**Mỗi mục chỉ có đúng 1 bản duy nhất** (không phải danh sách nhiều bài viết) —
bấm vào tên mục là vào thẳng form chỉnh sửa, không cần "Create New".

## 3. Các loại ô nhập liệu thường gặp

- **Ô chữ 1 dòng / nhiều dòng**: gõ trực tiếp, không có định dạng đậm/nghiêng
  (giữ đơn giản, không phải rich text).
- **Ô ảnh/video (Upload)**: bấm vào ô → **Select existing file** (chọn ảnh đã
  tải lên trước đó) hoặc **Upload new file** (tải ảnh/video mới từ máy). Video
  chỉ nhận định dạng `.mp4`.
- **Danh sách lặp lại (Array)**: ví dụ danh sách phim trong Carousel phim chính,
  hoặc danh sách phase — bấm **Add Row** để thêm 1 mục mới, bấm icon thùng rác
  để xoá, kéo thả để đổi thứ tự.
- **Ô lồng bên trong danh sách**: một số mục (ví dụ mỗi Phase trong "Chi tiết
  các Phase") có thêm 1 danh sách con bên trong (các video của Phase đó) — bấm
  mở rộng dòng đó ra để thấy các ô con.

## 4. Riêng phần video YouTube (Carousel phim chính, Chi tiết các Phase)

Ô **videoId** chỉ cần nhập đúng **ID video YouTube**, không phải cả đường link.
Ví dụ với link `https://www.youtube.com/watch?v=F3oRObMMNx8`, chỉ nhập phần
`F3oRObMMNx8`.

## 5. Lưu thay đổi

Mỗi form có nút **Save** (góc trên bên phải). Sau khi bấm Save, ra lại trang
web và **tải lại trang (F5)** để thấy thay đổi — nội dung không tự cập nhật
theo thời gian thực trong lúc đang mở sẵn tab web.

## 6. Một vài lưu ý quan trọng

- Nếu để trống 1 ô nào đó, website sẽ **tự hiện lại nội dung mặc định cũ**
  (không bị vỡ layout hay hiện trắng) — nên có thể chỉnh từng phần một, không
  cần điền đầy đủ hết mới lưu được.
- Logo hiển thị ở cả Header và Footer đều lấy từ **1 chỗ duy nhất**: mục
  "Cài đặt chung (Site Settings)" → ô Logo. Đổi ở đó là đổi ở cả 2 nơi.
- Ảnh nên đúng tỷ lệ được gợi ý trong tên field (ví dụ field có tên
  `pcImage`/`mwImage` dùng cho 2 kích thước màn hình khác nhau — máy tính (PC)
  và điện thoại (MW = Mobile Web), cần upload ảnh riêng cho từng cái).
