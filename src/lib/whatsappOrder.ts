import { business, whatsappLink } from '@/lib/business'
import { KWD, PRICE_LOCALE } from '@/lib/currency'

export type WhatsAppOrderLine = {
  title: string
  options?: string
  quantity: number
  /** السعر بالفلس (أصغر وحدة) كما يُخزَّن في قاعدة البيانات */
  unitPrice?: number | null
  url?: string
}

export const formatKWD = (fils: number) =>
  new Intl.NumberFormat(PRICE_LOCALE, {
    currency: KWD.code,
    maximumFractionDigits: KWD.decimals,
    minimumFractionDigits: KWD.decimals,
    style: 'currency',
  }).format(fils / Math.pow(10, KWD.decimals))

/** يبني نص رسالة الطلب الجاهزة لواتساب */
export const buildOrderMessage = (lines: WhatsAppOrderLine[], total?: number | null) => {
  const rows = lines.map((line, i) => {
    const parts = [`${i + 1}) ${line.title}`]
    if (line.options) parts.push(`(${line.options})`)
    parts.push(`× ${line.quantity}`)
    if (typeof line.unitPrice === 'number') parts.push(`— ${formatKWD(line.unitPrice)}`)
    const text = parts.join(' ')
    return line.url ? `${text}\n${line.url}` : text
  })

  const message = [`مرحبًا ${business.nameAr}، أريد طلب:`, '', ...rows]

  if (typeof total === 'number' && total > 0) {
    message.push('', `المجموع: ${formatKWD(total)}`)
  }

  return message.join('\n')
}

export const buildOrderLink = (lines: WhatsAppOrderLine[], total?: number | null) =>
  whatsappLink(buildOrderMessage(lines, total))

/** رسالة استفسار عن منتج واحد من صفحته */
export const buildProductInquiryLink = (title: string, url: string) =>
  whatsappLink(`مرحبًا ${business.nameAr}، أريد الاستفسار عن:\n${title}\n${url}`)
