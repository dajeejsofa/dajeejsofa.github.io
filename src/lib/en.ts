import { enPages, type EnPage } from '../data/en';
import { categoriesWithProducts, productsIn, productsForService } from './catalog';

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
