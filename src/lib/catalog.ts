import { getCollection, type CollectionEntry } from 'astro:content';

export type Product = CollectionEntry<'products'>;
export type Category = CollectionEntry<'categories'>;

const byOrder = <T extends { data: { order: number; title: string } }>(a: T, b: T) =>
  a.data.order - b.data.order || a.data.title.localeCompare(b.data.title, 'ar');

/** المنتجات المنشورة فقط (المسودات لا تظهر في الموقع) */
export const publishedProducts = async () =>
  (await getCollection('products', ({ data }) => !data.draft)).sort(byOrder);

/** الأقسام التي فيها منتج منشور واحد على الأقل — القسم الفارغ لا تُنشأ له صفحة */
export const categoriesWithProducts = async () => {
  const products = await publishedProducts();
  const used = new Set(products.map((p) => p.data.category).filter(Boolean));
  return (await getCollection('categories')).filter((c) => used.has(c.id)).sort(byOrder);
};

export const productsIn = async (categoryId: string) =>
  (await publishedProducts()).filter((p) => p.data.category === categoryId);

/** منتجات/أعمال كل خدمة: التنجيد والتصليح بحقل service، والتفصيل = كل منتج تفصيل ليس عمل خدمة */
export const productsForService = async (serviceId: string) =>
  (await publishedProducts()).filter((p) =>
    serviceId === 'tafseel-kanab' ? !p.data.service && !p.data.inStock : p.data.service === serviceId,
  );

/** أقل سعر للمتر بين مجموعة منتجات (للعناوين والأوصاف) */
export const priceFrom = (list: Product[]) => {
  const prices = list.map((p) => p.data.price).filter((n): n is number => typeof n === 'number' && n > 0);
  return prices.length ? Math.min(...prices) : undefined;
};

/** المناطق التي نُفّذت فيها أعمال من مجموعة منتجات، مع رابط أول عمل في كل منطقة */
export const areasOf = (list: Product[]) => {
  const map = new Map<string, Product>();
  for (const p of list) if (p.data.area && !map.has(p.data.area)) map.set(p.data.area, p);
  return [...map.entries()].map(([area, product]) => ({ area, product }));
};

export const productUrl = (p: Product) => `/products/${p.id}/`;

/** كل صور المنتج بالترتيب (الأولى هي الرئيسية)، بحد أقصى 8 */
export const productImages = (p: Product) => {
  const d = p.data;
  const all = [...d.images, ...(d.image ? [d.image] : []), ...d.gallery];
  const seen = new Set<string>();
  return all.filter((img) => (seen.has(img.src) ? false : (seen.add(img.src), true))).slice(0, 8);
};

/** وصف بديل للصورة: من اللوحة إن وُجد، وإلا اسم المنتج */
export const productAlt = (p: Product) => p.data.imageAlt || `${p.data.title} — ${'قنفات الضجيج'}`;
