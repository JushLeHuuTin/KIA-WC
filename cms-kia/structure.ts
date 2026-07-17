import type { DefaultDocumentNodeResolver, StructureBuilder, StructureResolver } from 'sanity/structure'
import { createPagePreview } from './components/PagePreview'

// Toàn bộ site là 1 trang landing duy nhất -- mỗi section (hero, main film
// carousel, phase overview, ...) chỉ có đúng 1 bản ghi (singleton), không phải
// danh sách nhiều document. Thêm section mới vào đây khi tạo schema tương ứng.
const SINGLETONS = ['siteSettings', 'hero', 'header', 'mainFilmCarousel', 'phaseOverview', 'phaseDetails', 'watchMore', 'experienceCarousel', 'connectStore', 'outro', 'footer'] as const

// Anchor id thật trên trang (nếu có) để tab "Xem trước" cuộn thẳng tới đúng
// section thay vì luôn load lại từ đầu trang -- chỉ những section có id trong
// DOM (xem PhaseDetails.tsx) mới cuộn được, còn lại load trang gốc.
const PREVIEW_ANCHORS: Partial<Record<(typeof SINGLETONS)[number], string>> = {
  phaseDetails: 'phase-1',
}

function createSingleton(S: StructureBuilder, typeName: string, title: string) {
  return S.listItem()
    .title(title)
    .id(typeName)
    .child(S.document().schemaType(typeName).documentId(typeName).title(title))
}

export const defaultDocumentNode: DefaultDocumentNodeResolver = (S, { schemaType }) => {
  if (!SINGLETONS.includes(schemaType as (typeof SINGLETONS)[number])) {
    return S.document().views([S.view.form()])
  }
  const anchor = PREVIEW_ANCHORS[schemaType as (typeof SINGLETONS)[number]]
  return S.document().views([
    S.view.form(),
    S.view.component(createPagePreview(anchor)).title('Xem trước'),
  ])
}

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Nội dung Website OMBC')
    .items([
      createSingleton(S, 'siteSettings', 'Cài đặt chung (Site Settings)'),

      S.divider(),

      createSingleton(S, 'header', 'Header (Menu điều hướng)'),
      createSingleton(S, 'hero', 'Hero (Mở đầu)'),
      createSingleton(S, 'mainFilmCarousel', 'Carousel phim chính'),
      createSingleton(S, 'phaseOverview', 'Tổng quan các Phase'),
      createSingleton(S, 'phaseDetails', 'Chi tiết các Phase'),
      createSingleton(S, 'watchMore', 'Nút xem thêm video'),
      createSingleton(S, 'experienceCarousel', 'Carousel Trải nghiệm'),
      createSingleton(S, 'connectStore', 'Kết nối cửa hàng'),
      createSingleton(S, 'outro', 'Outro (Kết thúc)'),
      createSingleton(S, 'footer', 'Footer'),

      S.divider(),

      ...S.documentTypeListItems().filter(
        (listItem) => !SINGLETONS.includes(listItem.getId() as (typeof SINGLETONS)[number]),
      ),
    ])
