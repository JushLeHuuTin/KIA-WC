'use client'

import React, { useEffect, useState } from 'react'

export const REMEMBER_EMAIL_STORAGE_KEY = 'payload-remembered-email'

// Nằm giữa Password và nút Login trong CustomLoginForm.tsx. Giá trị email tự
// điền được xử lý ở CustomLoginForm (đọc localStorage trước khi render, đưa
// vào initialState của <Form>) -- component này chỉ còn 2 việc: (1) hiện
// đúng trạng thái tích ban đầu (initiallyChecked, do CustomLoginForm tính sẵn
// dựa trên có email đã lưu hay không), (2) lưu/xoá localStorage khi người
// dùng gõ email hoặc bật/tắt checkbox.
export function RememberEmailCheckbox({ initiallyChecked }: { initiallyChecked: boolean }) {
  const [checked, setChecked] = useState(initiallyChecked)

  useEffect(() => {
    if (!checked) return
    // #field-email thuộc <EmailField> nằm ở component khác (sibling trong
    // CustomLoginForm), không phải con của component này -- không bubble lên
    // được qua React onInput, phải gắn listener DOM trực tiếp. Chỉ ĐỌC giá
    // trị để lưu localStorage (không set/mutate gì), nên không xung đột với
    // state nội bộ của <Form> như lần set-value trước đây.
    const emailInput = document.querySelector<HTMLInputElement>('#field-email')
    if (!emailInput) return
    const onInput = () => localStorage.setItem(REMEMBER_EMAIL_STORAGE_KEY, emailInput.value)
    emailInput.addEventListener('input', onInput)
    return () => emailInput.removeEventListener('input', onInput)
  }, [checked])

  const onToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked
    setChecked(isChecked)
    if (isChecked) {
      const emailInput = document.querySelector<HTMLInputElement>('#field-email')
      localStorage.setItem(REMEMBER_EMAIL_STORAGE_KEY, emailInput?.value ?? '')
    } else {
      localStorage.removeItem(REMEMBER_EMAIL_STORAGE_KEY)
    }
  }

  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', margin: '8px 0 16px' }}>
      <input type="checkbox" checked={checked} onChange={onToggle} />
      Ghi nhớ email của tôi
    </label>
  )
}
