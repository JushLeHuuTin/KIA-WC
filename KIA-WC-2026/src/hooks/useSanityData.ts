import { useEffect, useState } from 'react'
import { sanityClient } from '../lib/client'

// Hook fetch dữ liệu Sanity tối giản cho SPA (không SSR) -- đủ dùng cho quy mô
// trang này (~10 document singleton), không cần kéo thêm thư viện cache như
// react-query. Gọi lại fetch khi query đổi (thường không đổi giữa các lần render
// vì query là hằng số module-level).
export function useSanityData<T>(query: string) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    sanityClient
      .fetch<T>(query)
      .then((result) => {
        if (!cancelled) {
          setData(result)
          setLoading(false)
        }
      })
      .catch((error) => {
        console.error('Sanity fetch error:', error)
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [query])

  return { data, loading }
}
