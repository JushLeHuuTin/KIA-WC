# Tuỳ chỉnh giao diện Studio

Ghi lại các thay đổi đã thực hiện để làm Sanity Studio "sinh động"/chuyên
nghiệp hơn cho người dùng không rành kỹ thuật, thay vì để mặc định như lúc
mới `npm create sanity`. Đọc file này trước khi style thêm để tránh làm lại
hoặc phá vỡ những gì đã có.

## 1. Thương hiệu (branding)

**File:** `sanity.config.ts`, `components/StudioBranding.tsx`

- Logo Kia (path SVG lấy đúng từ `public/icons/kia-logo.svg` bên frontend)
  thay cho logo Sanity mặc định ở góc trên-trái Studio — component `KiaLogo`,
  gắn qua `studio.components.logo`.
- Icon Kia (nền navy `#05141F`, logo trắng) thay cho icon Sanity mặc định ở
  màn hình chọn workspace và tab trình duyệt — component `KiaIcon`, gắn qua
  `icon` ở gốc `defineConfig`.
- Tên workspace đổi từ `cms-kia` thành `OMBC — Kia FIFA World Cup 2026`
  (field `title` ở gốc `defineConfig`) — đây là dòng chữ hiện trên màn hình
  chọn workspace lúc đăng nhập.
- Màu thương hiệu (`kiaTheme`, dùng `buildLegacyTheme`) áp navy Kia
  (`#05141F`) cho nút mặc định/primary, trạng thái focus, thanh điều hướng —
  thay xanh dương mặc định của Sanity. Các màu trạng thái (success/warning/
  danger/info) vẫn giữ tông chuẩn (xanh lá/vàng/đỏ/xanh dương) để không phá
  vỡ ý nghĩa màu cảnh báo/lỗi quen thuộc.

## 2. Nhóm field theo tab (groups)

**File:** từng schema trong `schemaTypes/documents/`

Các object lồng nhau có từ 4 field trở lên (film, phase, phaseDetail,
phaseVideoItem, experience) được tách thành 2 tab:
- **"Nội dung"** (`icon: TextIcon`) — text, ID, mô tả.
- **"Hình ảnh"** / **"Hình ảnh / Video"** (`icon: ImageIcon`) — các field
  ảnh/video.

Áp dụng ở: `main-film-carousel.ts`, `phase-overview.ts`, `phase-details.ts`
(cả object `phaseDetail` lẫn `phaseVideoItem` lồng bên trong), `experience-carousel.ts`.

Chưa áp dụng cho các object nhỏ (≤3 field, vd `stayInspiredCard`,
`menuColumn`, `menuLink`, `navItem`, `socialLink`) — tách tab cho object quá
nhỏ chỉ gây thêm click, không giúp gì.

## 3. Preview có ảnh thật (media)

Toàn bộ array member object có field ảnh đều khai báo `preview.select.media`
trỏ tới field ảnh đó, để danh sách trong Studio hiện thumbnail ảnh thật thay
vì icon chung chung khi thu gọn/xem danh sách. Đã rà soát đủ cho tất cả các
document tạo trong phiên làm việc CMS.

## 4. Mô tả hướng dẫn (description) cho field ảnh

Thêm gợi ý tỉ lệ khung hình / lưu ý bố cục cho các field ảnh chính (poster
Hero, ảnh card Phase Overview, ảnh nền Phase Details, thumbnail Main Film
Carousel, ảnh card Experience Carousel, ảnh Connect Store/Outro, card "Stay
Inspired" ở Footer) — lấy đúng theo tỉ lệ thật đang dùng trong code frontend
(vd `aspect-square`, `aspect-[342/456]`...), không phải số phỏng đoán.

## 5. Tab "Xem trước" (Preview) nhúng trang thật

**File:** `components/PagePreview.tsx`, `structure.ts` (`defaultDocumentNode`)

Mỗi document singleton giờ có 2 tab: "Nội dung" (form nhập liệu như cũ) và
**"Xem trước"** — nhúng iframe trỏ thẳng vào trang thật đang chạy
(`http://localhost:5173`, đổi trong `PagePreview.tsx` nếu deploy domain khác).

Cố tình **không** tự dựng lại layout từng section bằng component riêng trong
Studio — cách đó dễ lệch khỏi giao diện thật theo thời gian (sửa code
frontend mà quên đồng bộ bản preview). Nhúng thẳng trang thật đảm bảo preview
luôn khớp 100% với những gì người dùng cuối thấy, đổi lại là: (1) chỉ xem
được **bản đã lưu/publish**, không phải bản nháp đang gõ dở (muốn full
draft-preview theo thời gian thực cần cắm thêm `@sanity/presentation` +
sửa frontend hỗ trợ stega/query param preview — chưa làm, xem mục "chưa
làm" bên dưới); (2) document `phaseDetails` cuộn sẵn tới `#phase-1` qua map
`PREVIEW_ANCHORS` trong `structure.ts`, các document khác load từ đầu trang
vì chưa có anchor DOM tương ứng.

## 6. Dán URL YouTube, tự tách video ID

**File:** `components/YouTubeIdInput.tsx`

Field `videoId` (ở `mainFilmCarousel` và `phaseDetails` → `items`) giờ dùng
input tuỳ chỉnh: dán cả URL đầy đủ (`watch?v=`, `youtu.be/`, `embed/`,
`shorts/`) sẽ tự tách ra đúng 11 ký tự ID; dán ID trần vẫn hoạt động bình
thường (không khớp pattern nào thì giữ nguyên).

## 7. Cảnh báo tỉ lệ ảnh sai (không chặn lưu)

**File:** `schemaTypes/shared/imageAspectRatio.ts`

Field ảnh có tỉ lệ khung hình cố định trong code frontend (`object-cover`
theo 1 aspect ratio nhất định) giờ có validation `.warning()` — sau khi
upload, Studio gọi GROQ lấy `metadata.dimensions` của ảnh, so với tỉ lệ kỳ
vọng (dung sai 8%), nếu lệch nhiều thì cảnh báo (không chặn publish, vì đôi
khi lệch có chủ đích). Áp dụng cho: `mainFilmCarousel` (thumbnail 2 kích
cỡ), `phaseOverview` (ảnh card), `phaseDetails` → `items` (thumbnail video),
`experienceCarousel` (3 field ảnh), `footer` → `stayInspiredCards`. Field
ảnh không có tỉ lệ ép cứng trong code (bgPc/bgMw của Phase Details, ảnh nền
Watch More/Connect Store/Outro, poster Hero) không cần validate vì
`object-cover` ở đó vốn tự do theo ảnh gốc.

<<<<<<< HEAD
=======
## 8. Rà soát lại icon cho hợp lý ngữ nghĩa hơn

Icon ban đầu chọn khá vội (nhiều chỗ tái dùng `ImageIcon`/`TextIcon` chung
chung hoặc chọn nhầm ý nghĩa). Đổi lại:
- `hero`: `ImageIcon` → `ExpandIcon` (banner toàn màn hình).
- `phaseDetails`: `StackIcon` → `OlistIcon` (danh sách có thứ tự, khớp
  Phase 1→4 tuần tự, phân biệt với `phaseOverview` dùng `ThLargeIcon` —
  lưới tổng quan).
- `watchMore`: `PresentationIcon` (không liên quan) → `EnterRightIcon` (CTA
  dẫn sang xem thêm).
- `footer`: `PanelLeftIcon` (vốn nghĩa "panel trái", sai ngữ cảnh) →
  `ThListIcon` (danh sách cột menu).

Bổ sung icon riêng cho **object lồng bên trong array** trước đây không có
gì (Studio tự hiện icon mặc định chung, không phân biệt được item nào là
gì khi nhìn lướt danh sách):
- `header` → `navItem`: `LinkIcon`
- `siteSettings` → `socialLink`: `ShareIcon`
- `footer` → `stayInspiredCard`: `ImageIcon`, → `menuColumn`: `FolderIcon`,
  → `menuColumn.items` (`menuLink`): `LinkIcon`
- `phaseOverview` → `phase`: `TagIcon`
- `phaseDetails` → `phaseDetail`: `DocumentTextIcon` (video item con
  `phaseVideoItem` đã có `PlayIcon` từ trước)
- `experienceCarousel` → `experience`: `ImageIcon`
- `mainFilmCarousel` → `film`: `VideoIcon`

Cũng thêm `placeholder` (chữ mờ gợi ý khi field còn trống) cho vài field
text hay bị hỏi "điền gì vào đây" nhất: `hero.kvTitle`/`kvHeadline`,
`watchMore.buttonTitle`/`buttonHref`, `footer.stayInspiredHeading`.

**Lưu ý quan trọng:** icon khai báo trong `defineType({icon: ...})` chỉ áp
dụng cho icon trong form/preview -- **không** tự áp dụng cho `S.listItem()`
ở sidebar (`structure.ts`). Ban đầu quên việc này nên toàn bộ sidebar vẫn
hiện icon folder mặc định giống hệt nhau dù đã đổi icon trong schema. Đã
sửa bằng cách gán tay `.icon(...)` cho từng `S.listItem()` qua map
`SINGLETON_ICONS` trong `structure.ts` -- **mỗi khi đổi icon của 1 document
trong schema, phải đổi cả icon tương ứng trong `SINGLETON_ICONS` (structure.ts),
2 nơi này không tự đồng bộ với nhau.**

>>>>>>> feature/setup-cms
## Việc còn có thể làm thêm (chưa làm, nếu cần nâng cấp tiếp)

- Draft-preview thời gian thực (Visual Editing/Presentation Tool đầy đủ) —
  hiện tab "Xem trước" chỉ hiện bản đã lưu, không phải bản đang gõ dở. Cần
  thêm plugin `@sanity/presentation` + sửa frontend hỗ trợ chế độ preview
  (query param/stega) — việc lớn hơn nhiều so với các mục trên, chưa làm.
- `buildLegacyTheme` (mục 1, màu thương hiệu) đang bị đánh dấu deprecated
  trong bản Sanity đang dùng (vẫn chạy đúng, chỉ là hint trong editor, không
  phải lỗi) — nếu sau này nâng cấp Sanity lên bản mới hẳn, nên tra lại API
  theme thay thế chính thức tại thời điểm đó thay vì tiếp tục dùng hàm
  deprecated.
