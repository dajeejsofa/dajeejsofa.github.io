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

export const productUrl = (p: Product) => `/products/${p.id}/`;
