import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// لوحة التحكم قد تحفظ الحقل الاختياري الفارغ كنص فارغ ('') — نعامله كأنه غير موجود
// فلا يفشل البناء ولا يُنشر عنوان فارغ.
const blank = (v: unknown) => (v === '' || v === null ? undefined : v);
const optStr = () => z.preprocess(blank, z.string().optional());
const opt = <T extends z.ZodTypeAny>(t: T) => z.preprocess(blank, t.optional());
const textOrEmpty = () => z.preprocess(blank, z.string().default(''));

const faqs = z
  .array(z.object({ question: z.string(), answer: z.string() }))
  .default([]);

// حقول جوجل المشتركة
const seo = {
  description: textOrEmpty(), // وصف جوجل
  seoTitle: optStr(), // عنوان جوجل (اختياري)
  focusKeyword: optStr(), // الكلمة المستهدفة
};

const products = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/products' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      urlSlug: optStr(), // رابط الصفحة كما يُكتب في اللوحة
      image: opt(image()),
      imageAlt: optStr(),
      gallery: z.array(image()).optional(),
      category: optStr(), // اسم ملف القسم في src/content/categories
      price: opt(z.number()), // بالدينار الكويتي
      priceUnit: z.preprocess(blank, z.enum(['piece', 'meter']).default('piece')), // للقطعة أو للمتر الطولي
      priceNote: optStr(),
      seats: opt(z.number()),
      width: opt(z.number()), // سم
      depth: opt(z.number()), // سم
      height: opt(z.number()), // سم
      fabric: optStr(),
      colors: z.array(z.string()).default([]),
      inStock: z.boolean().default(false), // false = تفصيل حسب الطلب
      order: z.number().default(0),
      draft: z.boolean().default(false),
      ...seo,
    }),
});

const categories = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/categories' }),
  schema: z.object({
    title: z.string(), // اسم القسم في القوائم
    h1: z.string(),
    order: z.number().default(0),
    faqs,
    ...seo,
  }),
});

const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: z.object({
    title: z.string(),
    h1: z.string(),
    order: z.number().default(0),
    faqs,
    ...seo,
  }),
});

export const collections = { products, categories, services };
