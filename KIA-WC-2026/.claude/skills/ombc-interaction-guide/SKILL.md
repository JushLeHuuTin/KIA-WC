---
name: ombc-interaction-guide
description: Chi tiết toàn bộ rule tương tác (scroll/hover/click) từ file "OMBC_Interaction Guide.pdf" của khách hàng, kèm bảng ánh xạ giữa số thứ tự trong PDF, tên frame Figma, tên folder asset, và component đã build trong KIA-WC-2026. Dùng khi build/sửa bất kỳ section nào của trang OMBC để tra đúng rule mà không cần đọc lại PDF hay dò lại Figma.
---

# OMBC Interaction Guide — tra cứu nhanh

Nguồn gốc: `Landing page/OMBC Website New/03. Interaction Guide/OMBC_Interaction Guide.pdf`
File tham chiếu để đối chiếu text/layout khi Figma bị rate-limit: `Landing page/OMBC Website New/02. Assets/00_Section Name.png` (ảnh rất lớn — crop từng vùng bằng PowerShell `System.Drawing` trước khi xem, xem cách làm ở cuối file).

## Rule chung (áp dụng mọi section)

- Nội dung text luôn xuất hiện theo thứ tự: **Title → Body Copy**.
- Nếu có nhiều đoạn văn, mỗi đoạn xuất hiện tuần tự từ trên xuống dưới.

## PC Interaction Guide (nguyên văn từ PDF, đánh số 1–11)

1. Khi cuộn xuống khỏi section đầu tiên, video pause + blur, intro copy xuất hiện. Cuộn lên lại thì video phát tiếp. Intro copy trượt từ dưới lên và xuất hiện toàn bộ cùng lúc (không animate từng đoạn). Cuộn thêm nữa thì intro copy fade out và logo xuất hiện.
2. Cuộn xuống thấy carousel thumbnail. Điều hướng bằng kéo trái/phải hoặc nút `<` `>` (hiện khi hover vào card). Click play → nhúng YouTube player trong vùng quy định.
3. Cuộn xuống, nội dung xuất hiện tuần tự: **Main Title → Subtitle → Image**. Mỗi Phase có anchor navigation — click nút sẽ cuộn trang tới section tương ứng.
4. (áp dụng chung cho mục 4–7) Cuộn xuống, nội dung xuất hiện tuần tự: **Main Title → Subtitle → Video Thumbnail Image → Video List**. Khi chọn 1 item trong list, item đang mở rộng thu gọn lại, item được chọn mở rộng ra, ảnh video chính đổi theo. List hoạt động theo vòng lặp vô hạn. Click play → nhúng YouTube player.
5–7. Giống hệt mục 4.
8. Cuộn xuống, nội dung xuất hiện tuần tự: **Main Title → Subtitle → Button**. Click button → chuyển tới trang liên kết.
9. Điều hướng carousel bằng kéo trái/phải hoặc nút `<` `>` (hiện khi hover). Carousel loop vô hạn.
10. Khi cuộn tới card section, ảnh xuất hiện với animation pop-up, copy trong từng card fade in. Click button → chuyển trang liên kết.
11. Cuộn xuống, outro copy xuất hiện tuần tự từ trên xuống, từng đoạn một, hiệu ứng fade-in.

## MW Interaction Guide (nguyên văn từ PDF, đánh số 1–5 — số của MW KHÔNG map 1-1 với số PC)

1. Giống PC (áp dụng cho KV/Hero).
2. Cuộn xuống, nội dung xuất hiện tuần tự: **Main Title → Subtitle → Video Thumbnail Image → Body Copy**. Click play → nhúng YouTube. Carousel ảnh swipe trái/phải, loop vô hạn.
   *(một mục "2" khác trong PDF, layout tách biệt)*: Cuộn xuống, **ảnh xuất hiện và giữ cố định (sticky)**. Cuộn thêm, **dim overlay** xuất hiện dần rồi mới đến copy. Nội dung tuần tự: **Main Title → Subtitle → Button**. Click button → chuyển trang.
3. Carousel ảnh swipe trái/phải, loop vô hạn.
4. (tương tự mục 2 — video list dạng swipe, loop vô hạn — áp dụng cho mục 4–7 bên PC)
5. Giống PC (áp dụng cho Outro).

⚠️ PDF gộp 2 mô tả khác nhau vào cùng số "2" ở cột MW do layout 2 cột bị trích xuất lẫn — đã tách rõ ở trên. Xem mục "Ghi chú quan trọng" bên dưới về cách tôi đã xác nhận mục "sticky + dim" áp dụng cho section nào.

## Bảng ánh xạ: số PDF ↔ Figma ↔ asset folder ↔ component (đã xác nhận qua build thực tế)

| PDF # | Nội dung | Figma frame name | Asset folder | Component | Trạng thái |
|---|---|---|---|---|---|
| 1 | KV/Hero: video pause+blur, intro copy, logo | `KV` + `[PC/MW] OMBC Intro`, `Intro(1)` | `01. KV` | `Hero.tsx` | ✅ Done |
| 2 | Carousel phim chính, play button | `Section_1` *(tên Figma gây nhầm — không phải "section 1" theo nghĩa thứ tự trang)* | `02. OMBC Cup Main Film` | `MainFilmCarousel.tsx` | ✅ Done |
| 3 | Card nav 4 Phase, anchor scroll | `Section_2` | `03. OMBC Cup` *(KHÔNG phải folder `04-07. Phase X`!)* | `PhaseOverview.tsx` | ✅ Done |
| 4–7 | Accordion video-list từng Phase 1–4 | `Section_3` (x3) + `Section_6` *(Phase 4 bị đặt tên "Section_6" trong Figma)* | `04. Phase 1` … `07. Phase 4` | `PhaseDetails.tsx` | ✅ Done |
| 8 | CTA: title→subtitle→button | `Section_8` | `08. OMBC Playlist` | `WatchMoreSection.tsx` | ✅ Done (đã xác nhận rule sticky+dim của MW áp dụng đúng ở đây, xem ghi chú) |
| 9 | Carousel "Experience Beyond the Match" | (chưa fetch được tên frame chính xác — Figma rate-limit) | `09. Additional Info` | `ExperienceCarousel.tsx` | ✅ Done |
| 10 | Card section: "Download the 49th Team Display Theme", ảnh pop-up (scale 0.85→1) + copy fade-in, button "Learn more" | (chưa fetch được — Figma rate-limit, xác nhận qua 00_Section Name.png) | `10. Connect Store` (1 ảnh duy nhất `10.jpg` cho cả PC/MW) | `ConnectStoreSection.tsx` | ✅ Done |
| 11 | Outro: 3 đoạn văn fade tuần tự (đoạn cuối in đậm), ảnh full-bleed | `Outro` | `11. Outro` (1 ảnh `11.jpg` cho cả PC/MW) | `OutroSection.tsx` | ✅ Done |
| — | Footer ("Stay Inspired" + 3 card + menu/social/legal) | `Footer` (node `1:1490`, gồm component instance `Footer` chuẩn của Kia) | — (3 ảnh card + toàn bộ icon tải trực tiếp từ Figma, không có trong `02. Assets`) | `Footer.tsx` (đặt ở `components/layout/`, không phải `sections/`, vì là site chrome dùng chung) | ✅ Done |

## Ghi chú quan trọng rút ra trong quá trình build

- **Tên frame Figma KHÔNG đáng tin cậy để xác định thứ tự trang.** Ví dụ "Section_1" trong Figma thực ra là carousel phim chính (PDF mục 2), không phải phần đầu trang. XML tree order của Figma cũng không phản ánh thứ tự hiển thị thực tế (do cách nhóm layer của designer) — phải dùng toạ độ Y để suy ra thứ tự thật, hoặc tốt nhất là dùng **số thứ tự folder asset** (`0X.`) làm neo tin cậy nhất vì nó khớp nhất quán với thứ tự trang thực tế.
- **Luôn kiểm tra số lượng file ảnh thật trong đúng folder asset trước khi build** — đừng suy đoán theo tên folder nghe "hợp lý". Case thực tế: card nav Phase 1-4 (PDF mục 3) tưởng dùng ảnh từ folder `04-07. Phase X` nhưng thực ra dùng đúng 4 ảnh trong folder `03. OMBC Cup` (khớp số lượng 4 card).
- **Chấm pagination trong ảnh preview Figma hay vẽ mặc định 5 chấm** dù carousel thực tế chỉ có 3-4 item — đây là component mẫu generic của design system, không phải spec thật. Luôn đếm số ảnh thật trong asset folder để xác định số item, không đếm chấm trong ảnh preview.
- **Không tự bịa/diễn giải lại copy.** Nếu ảnh mẫu 00_Section_Name.png chỉ hiện được 1 trạng thái carousel (vd chỉ thấy caption của item đang active), phải hỏi người dùng lấy caption thật cho các item còn lại thay vì tự viết — đã có case thực tế viết sai hoàn toàn nội dung do tự diễn giải.
- **MW "sticky + dim overlay" rule đã xác nhận áp dụng cho PDF mục 8** (`WatchMoreSection.tsx`) qua build + test trực quan (Playwright screenshot qua 3 mốc cuộn: ảnh tĩnh → dim tăng dần + text fade in → giải phóng sang section kế). Các mục MW còn lại (carousel swipe cho mục 2, 9) đã áp dụng nhưng chưa 100% xác nhận qua Figma do rate-limit — nên đối chiếu lại nếu Figma khả dụng trở lại.
- **PDF mục 9 ban đầu chỉ có điều hướng bằng click** (ảnh chính, thumbnail, dot, nút mũi tên hover) — thiếu hẳn "kéo trái/phải". Đã bổ sung `useSwipe` (Pointer Events thủ công, không dùng `drag` prop của Motion) trong `ExperienceCarousel.tsx`, áp dụng cho cả `DesktopVersion` (container ảnh chính) và `MobileVersion` (track ảnh). Đã verify bằng Playwright mouse-drag simulation cả 2 chiều trên cả 2 breakpoint — xác nhận đổi đúng item, không lỗi console. **Lưu ý khi test carousel loop thủ công bằng Playwright**: `boundingBox()` của chính div bị áp `translateX(-N * 100%)` trả về toạ độ SAI (lệch hẳn ra ngoài viewport), vì phần trăm transform tính theo width của chính element đó (chỉ bằng 1 slide, do các item con dùng `w-full` bên trong flex không có width) chứ không phải theo tổng chiều rộng nội dung đã overflow — phải đo/thao tác trên wrapper `overflow-hidden` bên ngoài (khớp đúng pixel hiển thị thật) thay vì đo trực tiếp track đã transform.
- **Rate-limit Figma MCP đôi khi tự reset giữa các lần gọi rồi lại bị giới hạn ngay sau 1 lần gọi tiếp theo** — nếu vừa gọi được `get_design_context` thành công, LUÔN lưu lại toàn bộ URL asset (`const imgXxx = "https://www.figma.com/api/mcp/asset/..."`) xuất hiện trong response đó ngay, vì các URL này tải trực tiếp bằng `curl` được (hiệu lực ~7 ngày) mà không tốn thêm lượt gọi MCP nào — dùng để tải hàng loạt icon/ảnh cùng lúc dù bị rate-limit ngay sau đó.
- **Figma MCP hay bị rate-limit (gói Starter).** Khi gặp, dùng `00_Section Name.png` (ảnh gốc rất lớn, ~11324×13547px, vượt giới hạn đọc ảnh 2000×2000) — crop bằng PowerShell trước:
  ```powershell
  Add-Type -AssemblyName System.Drawing
  $img = [System.Drawing.Image]::FromFile("...00_Section Name.png")
  $rect = New-Object System.Drawing.Rectangle(X, Y, WIDTH, HEIGHT)
  $bmp = New-Object System.Drawing.Bitmap($rect.Width, $rect.Height)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.DrawImage($img, (New-Object System.Drawing.Rectangle(0,0,$rect.Width,$rect.Height)), $rect, [System.Drawing.GraphicsUnit]::Pixel)
  $bmp.Save($dst, [System.Drawing.Imaging.ImageFormat]::Png)
  ```
  Mỗi section trong file cao khoảng 900-1300px, section sau nằm ngay dưới section trước theo trục Y tăng dần — dò dần bằng cách crop thử một vùng rộng rồi tinh chỉnh toạ độ.
