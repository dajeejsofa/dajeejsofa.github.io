import { business, fullAddressAr } from '@/lib/business'
import { getServerSideURL } from '@/utilities/getURL'

// ملف llms.txt: ملخص واضح لأدوات الذكاء الاصطناعي عن النشاط وروابطه
export const dynamic = 'force-static'

export function GET() {
  const url = getServerSideURL()
  const lines = [
    `# ${business.nameAr} (${business.nameEn})`,
    '',
    `> ${business.descriptionAr}`,
    '',
    `> ${business.descriptionEn}`,
    '',
    '## معلومات النشاط',
    '',
    `- العنوان: ${business.unit ? `${business.unit}، ` : ''}${fullAddressAr}`,
    `- الهاتف وواتساب: ${business.phone} (+965${business.phone})`,
    '- الطلب: عبر واتساب فقط، والأسعار بالدينار الكويتي.',
    '- الخدمات: بيع كنب وقنفات جاهزة، تفصيل كنب حسب المقاس، تنجيد وتلبيس الكنب، تصليح الكنب.',
    '',
    '## روابط',
    '',
    `- [الرئيسية](${url}/)`,
    `- [كل المنتجات](${url}/shop)`,
    `- [خريطة الموقع](${url}/sitemap.xml)`,
    '',
  ]
  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
