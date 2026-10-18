import React from 'react'

import { WhatsAppIcon } from '@/components/icons/whatsapp'
import { business, whatsappLink } from '@/lib/business'

/** زر واتساب ثابت أسفل الشاشة في كل الصفحات */
export function WhatsAppFloat() {
  return (
    <a
      aria-label={`تواصل مع ${business.nameAr} عبر واتساب`}
      className="fixed bottom-5 left-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg hover:opacity-90"
      href={whatsappLink(`مرحبًا ${business.nameAr}، عندي استفسار.`)}
      rel="noopener noreferrer"
      target="_blank"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  )
}
