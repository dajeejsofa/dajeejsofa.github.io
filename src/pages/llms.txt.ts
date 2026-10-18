import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { business, fullAddress } from '../data/business';
import { categoriesWithProducts } from '../lib/catalog';

// ملخص واضح للنشاط لأدوات الذكاء الاصطناعي (llms.txt)
export const GET: APIRoute = async ({ site }) => {
  const u = (p: string) => new URL(p, site).toString();
  const services = (await getCollection('services')).sort((a, b) => a.data.order - b.data.order);
  const cats = await categoriesWithProducts();
  const lines = [
    `# ${business.name} (${business.nameEn})`,
    '',
    `> ${business.description}`,
    '',
    `> ${business.descriptionEn}`,
    '',
    '## معلومات النشاط',
    `- العنوان: ${fullAddress}`,
    `- الهاتف وواتساب: ${business.phone} (+965${business.phone})`,
    '- الطلب: عبر واتساب فقط، والأسعار بالدينار الكويتي.',
    ...(business.openingHoursText ? [`- ساعات العمل: ${business.openingHoursText}`] : []),
    '',
    '## الخدمات',
    ...services.map((s) => `- [${s.data.h1}](${u(`/${s.id}/`)}): ${s.data.description}`),
    `- [معرض الكنب في الضجيج](${u('/maarad-dajeej/')})`,
    '',
    '## المنتجات',
    `- [كل المنتجات](${u('/shop/')})`,
    ...cats.map((c) => `- [${c.data.h1}](${u(`/${c.id}/`)})`),
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
