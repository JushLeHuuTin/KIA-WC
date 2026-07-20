'use client'

import React from 'react'
import { EmailField, Form, FormSubmit, Link, PasswordField, useAuth, useConfig, useTranslation } from '@payloadcms/ui'
import { email as validateEmail, formatAdminURL, getSafeRedirect } from 'payload/shared'
import { REMEMBER_EMAIL_STORAGE_KEY, RememberEmailCheckbox } from './RememberEmailCheckbox'

// Đọc localStorage NGAY LÚC RENDER (không phải trong useEffect sau khi mount)
// để đưa thẳng vào initialState của <Form> -- lần fix trước (mutate DOM input
// bằng native setter sau khi mount) không ăn: Form của Payload tự quản lý
// state field nội bộ, việc set value trực tiếp vào DOM từ ngoài bị đè lại bởi
// state nội bộ đó ngay sau render kế tiếp (checkbox tự tích đúng vì đó là
// state của riêng component này, nhưng ô email vẫn trống). Đọc trước khi
// Form mount thì Form khởi tạo đúng từ đầu, không cần "thắng" state của nó.
function getRememberedEmail(): string {
  if (typeof window === 'undefined') return ''
  return localStorage.getItem(REMEMBER_EMAIL_STORAGE_KEY) ?? ''
}

// Form đăng nhập viết riêng, KHÔNG dùng LoginView/LoginForm dựng sẵn của
// Payload -- lý do duy nhất là để đặt checkbox "Ghi nhớ email" đúng vị trí
// giữa Password và nút Login, vị trí mà Payload không có slot nào (chỉ có
// beforeLogin/afterLogin, đều nằm NGOÀI toàn bộ form). Toàn bộ logic đăng
// nhập thật (gọi API, set cookie, redirect) vẫn dùng đúng các component gốc
// của Payload (<Form>, <EmailField>, <PasswordField>, <FormSubmit>) -- chỉ
// sắp lại thứ tự JSX, không viết lại bất kỳ xử lý auth nào.
export function CustomLoginForm({ redirectParam }: { redirectParam?: string }) {
  const { config } = useConfig()
  const {
    admin: { routes: { forgot: forgotRoute } },
    routes: { admin: adminRoute, api: apiRoute },
  } = config
  const { setUser } = useAuth()
  const { t } = useTranslation()
  const rememberedEmail = getRememberedEmail()

  return (
    <Form
      action={formatAdminURL({ apiRoute, path: '/users/login' })}
      method="POST"
      initialState={{
        email: { initialValue: rememberedEmail, valid: true, value: rememberedEmail },
        password: { initialValue: '', valid: true, value: '' },
      }}
      onSuccess={(data: unknown) => setUser(data as Parameters<typeof setUser>[0])}
      redirect={getSafeRedirect({ fallbackTo: adminRoute, redirectTo: redirectParam ?? '' })}
      waitForAutocomplete
    >
      <div className="login__form__inputWrap">
        <EmailField
          field={{ name: 'email', admin: { autoComplete: 'email' }, label: t('general:email'), required: true }}
          path="email"
          validate={validateEmail}
        />
        <PasswordField field={{ name: 'password', label: t('general:password'), required: true }} path="password" />
      </div>

      <RememberEmailCheckbox initiallyChecked={rememberedEmail !== ''} />

      <Link href={formatAdminURL({ adminRoute, path: forgotRoute })} prefetch={false}>
        {t('authentication:forgotPasswordQuestion')}
      </Link>

      <FormSubmit size="large">{t('authentication:login')}</FormSubmit>
    </Form>
  )
}
