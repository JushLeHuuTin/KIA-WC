import type { SanityClient } from '@sanity/client'

interface ImageValueLike {
  asset?: { _ref?: string }
}

interface ValidationContextLike {
  getClient: (options: { apiVersion: string }) => SanityClient
}

interface CustomizableRule {
  custom: (
    fn: (value: ImageValueLike | undefined, context: ValidationContextLike) => true | string | Promise<true | string>,
  ) => { warning: () => unknown }
}

// Cảnh báo (không chặn lưu/publish) nếu ảnh upload lệch quá nhiều so với tỉ lệ
// khung hình mà component frontend thực sự dùng (object-cover sẽ crop lệch
// nếu ảnh sai tỉ lệ). Chỉ dùng cho field có tỉ lệ cố định trong code -- field
// nào code không ép tỉ lệ (object-cover tự do theo ảnh gốc) thì không cần.
//
// Nhận `rule` qua generic (thay vì import thẳng type `ImageRule` từ `sanity`,
// tên export thay đổi/khó xác định giữa các bản) -- chỉ cần rule có `.custom()`.
export function withAspectRatioWarning<R extends CustomizableRule>(
  rule: R,
  expectedRatio: number,
  label: string,
  tolerance = 0.08,
): R {
  return rule
    .custom(async (image, context) => {
      const ref = image?.asset?._ref
      if (!ref) return true

      const client = context.getClient({ apiVersion: '2024-01-01' })
      const asset = await client.fetch<{ w?: number; h?: number }>(
        `*[_id == $id][0]{ "w": metadata.dimensions.width, "h": metadata.dimensions.height }`,
        { id: ref },
      )
      if (!asset?.w || !asset?.h) return true

      const actualRatio = asset.w / asset.h
      const diff = Math.abs(actualRatio - expectedRatio) / expectedRatio
      if (diff > tolerance) {
        return `Ảnh hiện tại ${asset.w}×${asset.h}px (tỉ lệ ~${actualRatio.toFixed(2)}:1), lệch khá nhiều so với khuyến nghị ${label}. Ảnh vẫn lưu được nhưng có thể bị cắt lệch bố cục trên trang.`
      }
      return true
    })
    .warning() as R
}
