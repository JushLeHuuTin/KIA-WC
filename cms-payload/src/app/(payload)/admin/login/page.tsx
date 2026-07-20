import React from 'react'
import config from '@payload-config'
import { getPayload } from 'payload'
import { headers as getHeaders } from 'next/headers'
import { redirect } from 'next/navigation'
import { getSafeRedirect } from 'payload/shared'
import { MinimalTemplate } from '@payloadcms/next/templates'
import { KiaLogo } from '../../../../components/KiaLogo'
import { CustomLoginForm } from '../../../../components/CustomLoginForm'
import { LoginFooter } from '../../../../components/LoginFooter'

// Route riêng cho /admin/login -- Next.js ưu tiên route tĩnh này hơn route
// catch-all admin/[[...segments]]/page.tsx (dùng cho mọi trang admin khác),
// nên chỉ ảnh hưởng đúng trang đăng nhập, không đụng gì các trang còn lại.
// Xem CustomLoginForm.tsx để biết lý do phải tách route riêng.
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>
}) {
  const { redirect: redirectParam } = await searchParams
  const payload = await getPayload({ config })
  const headers = await getHeaders()
  const { user } = await payload.auth({ headers })

  if (user) {
    redirect(getSafeRedirect({ fallbackTo: '/admin', redirectTo: redirectParam ?? '' }))
  }

  return (
    <MinimalTemplate className="login">
      <div className="login__brand">
        <KiaLogo />
      </div>
      <CustomLoginForm redirectParam={redirectParam} />
      <LoginFooter />
    </MinimalTemplate>
  )
}
