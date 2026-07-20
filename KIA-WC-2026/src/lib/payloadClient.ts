// Client gọi REST API của Payload CMS -- thay dần cho src/lib/client.ts (Sanity).
// Payload tự sinh REST API cho mỗi Global tại /api/globals/<slug>, trả về
// đúng 1 JSON object (không cần lọc _id như GROQ trước đây). depth=1 để field
// kiểu "upload" (ảnh/video) được resolve thành object đầy đủ có .url, thay vì
// chỉ trả về id -- tương đương ".asset->url" của GROQ.
const PAYLOAD_API_URL = import.meta.env.VITE_PAYLOAD_API_URL as string

export async function fetchGlobal<T>(slug: string, depth = 1): Promise<T> {
  const res = await fetch(`${PAYLOAD_API_URL}/globals/${slug}?depth=${depth}`)
  if (!res.ok) {
    throw new Error(`Payload fetch error (${slug}): ${res.status} ${res.statusText}`)
  }
  return res.json() as Promise<T>
}
