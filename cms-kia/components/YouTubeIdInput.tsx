import { useCallback } from 'react'
import { TextInput } from '@sanity/ui'
import { set, unset, type StringInputProps } from 'sanity'

// Cho phép dán cả URL YouTube đầy đủ (watch?v=, youtu.be/, embed/, shorts/)
// -- tự tách ra đúng video ID thay vì bắt người dùng tự cắt thủ công. Nếu
// không khớp URL nào thì giữ nguyên input (coi như đã là ID).
function extractYouTubeId(raw: string): string {
  const trimmed = raw.trim()
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ]
  for (const pattern of patterns) {
    const match = trimmed.match(pattern)
    if (match) return match[1]
  }
  return trimmed
}

export function YouTubeIdInput(props: StringInputProps) {
  const { onChange, value, elementProps } = props

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const id = extractYouTubeId(event.currentTarget.value)
      onChange(id ? set(id) : unset())
    },
    [onChange],
  )

  return (
    <TextInput
      {...elementProps}
      value={value ?? ''}
      onChange={handleChange}
      placeholder="Dán URL YouTube hoặc chỉ ID (vd: 4jjOH2FR6-E)"
    />
  )
}
