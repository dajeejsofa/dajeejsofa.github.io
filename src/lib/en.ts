import { enPages, type EnPage } from '../data/en';
import { categoriesWithProducts, productsIn, productsForService, publishedProducts, type Product } from './catalog';

/** الصفحات الإنجليزية التي لها صفحة عربية منشورة (القسم بلا منتجات لا صفحة له في اللغتين) */
export const liveEnPages = async (): Promise<EnPage[]> => {
  const cats = new Set((await categoriesWithProducts()).map((c) => c.id));
  return enPages.filter((p) => p.kind === 'service' || cats.has(p.ar));
};

/** رابط الصفحة الإنجليزية المقابلة لصفحة عربية، أو undefined إن لم توجد */
export const enHrefFor = async (arId: string) => {
  const p = (await liveEnPages()).find((x) => x.ar === arId);
  return p ? `/en/${p.slug}/` : undefined;
};

export const productsOf = (p: EnPage) => (p.kind === 'service' ? productsForService(p.ar) : productsIn(p.ar));

// ───── منتجات النسخة الإنجليزية ─────

/** أسماء المناطق بالإنجليزية (المنطقة تُكتب بالعربية في اللوحة) */
const areaNames: Record<string, string> = {
  'الجهراء': 'Jahra', 'حولي': 'Hawalli', 'السالمية': 'Salmiya', 'الرابية': 'Al Rabiya', 'صباح السالم': 'Sabah Al Salem',
  'صباح الأحمد': 'Sabah Al Ahmad', 'مبارك الكبير': 'Mubarak Al Kabeer', 'خيطان': 'Khaitan', 'الدوحة': 'Doha', 'القيروان': 'Al Qairawan',
  'الفروانية': 'Farwaniya', 'الأحمدي': 'Ahmadi', 'العاصمة': 'Kuwait City', 'الجابرية': 'Jabriya', 'مشرف': 'Mishref',
};
export const areaEn = (ar?: string) => (ar ? areaNames[ar] : undefined);

/** المنتجات التي لها اسم إنجليزي فقط — المنتج بلا اسم إنجليزي لا يظهر بالإنجليزية بنص عربي */
export const enProducts = async () => (await publishedProducts()).filter((p) => Boolean(p.data.titleEn));
export const enProductUrl = (p: Product) => `/en/products/${p.id}/`;
export const enProductsOf = async (page: EnPage) => (await productsOf(page)).filter((p) => Boolean(p.data.titleEn));

/** وصف إنجليزي: من اللوحة إن وُجد، وإلا جملة من الاسم والسعر والتنفيذ */
export const enProductDescription = (p: Product) => {
  const d = p.data;
  if (d.descriptionEn) return d.descriptionEn;
  const area = areaEn(d.area);
  const price = typeof d.price === 'number' && d.price > 0 ? ` ${d.price} KWD per linear metre, fabric included.` : '';
  if (d.service === 'tanjeed-kanab')
    return `${d.titleEn}: fabric reupholstery done in our workshop in Al Dajeej, Kuwait${area ? `, for a customer in ${area}` : ''}.${price}`;
  return `${d.titleEn}, made to order to the size of your room in our workshop in Al Dajeej, Kuwait${area ? ` (previous work for a customer in ${area})` : ''}.${price}`;
};
