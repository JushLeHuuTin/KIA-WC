import { useEffect, useState } from 'react'
import { fetchGlobal } from '../lib/payloadClient'

// Giữ đúng shape { data, loading } của useSanityData.ts để component không
// phải đổi gì ngoài import + tên hook khi migrate.
export function usePayloadData<T>(slug: string) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchGlobal<T>(slug)
      .then((result) => {
        if (!cancelled) {
          setData(result)
          setLoading(false)
        }
      })
      .catch((error) => {
        console.error('Payload fetch error:', error)
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [slug])

  return { data, loading }
}
