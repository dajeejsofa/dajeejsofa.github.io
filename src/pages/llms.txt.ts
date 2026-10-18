import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { business, fullAddress } from '../data/business';
import { categoriesWithProducts, publishedProducts, productsForService, priceFrom, areasOf } from '../lib/catalog';

// ملخص واضح للنشاط لأدوات الذكاء الاصطناعي (llms.txt)
export const GET: APIRoute = async ({ site }) => {
  const u = (p: string) => new URL(p, site).toString();
  const services = (await getCollection('services')).sort((a, b) => a.data.order - b.data.order);
  const cats = await categoriesWithProducts();
  const all = await publishedProducts();
  const tafseelFrom = priceFrom(await productsForService('tafseel-kanab'));
  const tanjeedFrom = priceFrom(await productsForService('tanjeed-kanab'));
  const areas = areasOf(all).map((a) => a.area);
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
    '## الأسعار',
    '- كل الأسعار بالمتر الطولي وشاملة القماش، والكراسي المفردة سعرها بالاتفاق.',
    ...(tafseelFrom ? [`- تفصيل الكنب حسب المقاس: من ${tafseelFrom} د.ك للمتر.`] : []),
    ...(tanjeedFrom ? [`- تنجيد الكنب بالقماش (في المشغل، ولا ننجّد الجلد): ${tanjeedFrom} د.ك للمتر.`] : []),
    ...(areas.length ? ['', '## مناطق نفّذنا فيها أعمالًا', `- ${areas.join('، ')}`] : []),
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
