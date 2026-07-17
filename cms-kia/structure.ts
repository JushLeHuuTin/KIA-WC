<<<<<<< HEAD
import type { DefaultDocumentNodeResolver, StructureBuilder, StructureResolver } from 'sanity/structure'
import { createPagePreview } from './components/PagePreview'
=======
import type { ComponentType } from 'react'
import type { DefaultDocumentNodeResolver, StructureBuilder, StructureResolver } from 'sanity/structure'
import { createPagePreview } from './components/PagePreview'
import { CogIcon } from '@sanity/icons/Cog'
import { MenuIcon } from '@sanity/icons/Menu'
import { ExpandIcon } from '@sanity/icons/Expand'
import { PlayIcon } from '@sanity/icons/Play'
import { ThLargeIcon } from '@sanity/icons/ThLarge'
import { OlistIcon } from '@sanity/icons/Olist'
import { EnterRightIcon } from '@sanity/icons/EnterRight'
import { ImagesIcon } from '@sanity/icons/Images'
import { LaunchIcon } from '@sanity/icons/Launch'
import { RocketIcon } from '@sanity/icons/Rocket'
import { ThListIcon } from '@sanity/icons/ThList'
>>>>>>> feature/setup-cms

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

<<<<<<< HEAD
function createSingleton(S: StructureBuilder, typeName: string, title: string) {
  return S.listItem()
    .title(title)
    .id(typeName)
=======
// S.listItem() KHÔNG tự lấy icon khai báo trong defineType({icon: ...}) của
// schema -- phải gán tay lại ở đây, nếu không toàn bộ sidebar chỉ hiện icon
// folder mặc định giống nhau. Icon phải khớp đúng icon đã đặt cho document đó
// trong schemaTypes/documents/*.ts (xem STUDIO_CUSTOMIZATION.md mục 8).
const SINGLETON_ICONS: Record<(typeof SINGLETONS)[number], ComponentType> = {
  siteSettings: CogIcon,
  header: MenuIcon,
  hero: ExpandIcon,
  mainFilmCarousel: PlayIcon,
  phaseOverview: ThLargeIcon,
  phaseDetails: OlistIcon,
  watchMore: EnterRightIcon,
  experienceCarousel: ImagesIcon,
  connectStore: LaunchIcon,
  outro: RocketIcon,
  footer: ThListIcon,
}

function createSingleton(S: StructureBuilder, typeName: (typeof SINGLETONS)[number], title: string) {
  return S.listItem()
    .title(title)
    .id(typeName)
    .icon(SINGLETON_ICONS[typeName])
>>>>>>> feature/setup-cms
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
