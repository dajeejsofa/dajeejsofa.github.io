import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { business, fullAddress, returnPolicy } from '../data/business';
import { categoriesWithProducts, publishedProducts, productsForService, productsIn, priceFrom, priceTextEn, areasOf, fillPrice } from '../lib/catalog';
import { liveEnPages, productsOf } from '../lib/en';

// ملخص واضح للنشاط لأدوات الذكاء الاصطناعي (llms.txt)
export const GET: APIRoute = async ({ site }) => {
  const u = (p: string) => new URL(p, site).toString();
  const services = (await getCollection('services')).sort((a, b) => a.data.order - b.data.order);
  const cats = await categoriesWithProducts();
  const all = await publishedProducts();
  const tafseelFrom = priceFrom(await productsForService('tafseel-kanab'));
  const tanjeedFrom = priceFrom(await productsForService('tanjeed-kanab'));
  const areas = areasOf(all).map((a) => a.area);
  const en = await liveEnPages();
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
    ...(tanjeedFrom ? [`- تنجيد الكنب بالقماش في المشغل: ${tanjeedFrom} د.ك للمتر.`] : []),
    ...(areas.length ? ['', '## مناطق نفّذنا فيها أعمالًا', `- ${areas.join('، ')}`] : []),
    '',
    '## حدود الخدمات بدقة',
    '- التنجيد بالأقمشة فقط، ويتم في مشغلنا بالضجيج.',
    '- التصليح يشمل أرجل الكنب والإسفنج فقط، ويتم في مشغلنا بالضجيج.',
    '- شدّ القماش يكون ضمن التنجيد، وليس خدمة منفصلة.',
    `- ${returnPolicy.text}`,
    '',
    '## الخدمات',
    ...(await Promise.all(services.map(async (s) => { const list = await productsForService(s.id); return `- [${fillPrice(s.data.h1, list)}](${u(`/${s.id}/`)}): ${fillPrice(s.data.description, list)}`; }))),
    `- [معرض الكنب في الضجيج](${u('/maarad-dajeej/')})`,
    '',
    '## المنتجات',
    `- [كل المنتجات](${u('/shop/')})`,
    ...(await Promise.all(cats.map(async (c) => `- [${fillPrice(c.data.h1, await productsIn(c.id))}](${u(`/${c.id}/`)})`))),
    '',
    '## English',
    `- [${business.nameEn} — custom sofas, sofa upholstery and sofa repair in Kuwait](${u('/en/')})`,
    `- Location: Katara Complex, Al Dajeej, Kuwait. Phone/WhatsApp: +965${business.phone}. Orders by WhatsApp only; prices in Kuwaiti dinars.`,
    '- All sofas are made to order in our workshop, priced per linear metre with the fabric included. Single armchairs are priced on agreement.',
    '- Upholstery is in fabric, in our workshop. Sofa repair covers sofa legs and foam, in our workshop.',
    ...(await Promise.all(en.map(async (p) => (p.ar === 'tasleeh-kanab' ? `- [${p.name}](${u(`/en/${p.slug}/`)}): sofa legs and foam, in our workshop.` : `- [${p.name}](${u(`/en/${p.slug}/`)}): ${priceTextEn(await productsOf(p))}, fabric included.`)))),
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
