import { Card, Text, Stack, Flex, Button } from '@sanity/ui'
import { LaunchIcon } from '@sanity/icons/Launch'

// Nhúng thẳng trang thật (đang chạy `npm run dev` bên KIA-WC-2026) vào 1 tab
// trong Studio, cuộn tới đúng section đang chỉnh -- không phải render lại
// layout thật bằng component riêng (dễ lệch khỏi code thật theo thời gian).
// Đây là bản xem trước đơn giản (không phải Presentation Tool đầy đủ với
// draft overlay) -- chỉ hiện bản đã publish/đang chạy ở localhost:5173.
const SITE_URL = 'http://localhost:5173'

export function createPagePreview(anchor?: string) {
  return function PagePreview() {
    const url = anchor ? `${SITE_URL}/#${anchor}` : SITE_URL

    return (
      <Stack height="fill">
        <Card padding={3} borderBottom tone="transparent">
          <Flex align="center" justify="space-between">
            <Text size={1} muted>
              Xem trực tiếp trang thật đang chạy tại <code>{SITE_URL}</code> (chạy{' '}
              <code>npm run dev</code> ở KIA-WC-2026 để xem). Đây là bản đã lưu, không phải bản
              nháp chưa publish.
            </Text>
            <Button
              as="a"
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              mode="ghost"
              text="Mở tab mới"
              icon={LaunchIcon}
            />
          </Flex>
        </Card>
        <Card flex={1} style={{ position: 'relative' }}>
          <iframe
            src={url}
            title="Xem trước trang thật"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
          />
        </Card>
      </Stack>
    )
  }
}
