import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
const errors = []
page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()) })
page.on('pageerror', (err) => errors.push('pageerror: ' + err.message))

await page.goto('http://localhost:5173', { waitUntil: 'networkidle' })
await page.waitForTimeout(500)
await page.screenshot({ path: 'C:/Users/Dong Pham/Downloads/KIA-WC/KIA-WC-2026/_shot-header.png' })

if (errors.length) {
  console.log('ERRORS:', errors)
} else {
  console.log('No console errors.')
}
await browser.close()
