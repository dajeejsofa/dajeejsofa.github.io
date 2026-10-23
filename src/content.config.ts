import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// لوحة التحكم قد تحفظ الحقل الاختياري الفارغ كنص فارغ ('') — نعامله كأنه غير موجود
// فلا يفشل البناء ولا يُنشر عنوان فارغ.
const blank = (v: unknown) => (v === '' || v === null ? undefined : v);
const optStr = () => z.preprocess(blank, z.string().optional());
const opt = <T extends z.ZodTypeAny>(t: T) => z.preprocess(blank, t.optional());
const textOrEmpty = () => z.preprocess(blank, z.string().default(''));

// الصور المختارة من مكتبة اللوحة العامة تُحفظ بمسار مطلق (/uploads/…)، وAstro يحسّن الصور
// المرتبطة بمسار نسبي فقط — نحوّلها إلى مسارها الفعلي داخل المستودع فلا يفشل البناء أبدًا.
const fixPath = (v: unknown) =>
  typeof v === 'string' && v.startsWith('/uploads/') ? `../../../public${v}` : v;
// حقل الصور يقبل صورة واحدة أو عدة صور (حتى 8)، ويُهمل الفارغ
const toList = (v: unknown) =>
  (Array.isArray(v) ? v : v ? [v] : []).map(fixPath).filter((x) => x !== '' && x != null);

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
      // الصور: الأولى هي الرئيسية (حتى 8 صور)
      images: z.preprocess(toList, z.array(image()).default([])),
      // حقول قديمة مدعومة للتوافق
      image: z.preprocess((v) => fixPath(blank(v)), image().optional()),
      gallery: z.preprocess(toList, z.array(image()).default([])),
      imageAlt: optStr(),
      category: optStr(), // اسم ملف القسم في src/content/categories
      service: optStr(), // خدمة العمل إن كان عمل تنجيد أو تصليح (tanjeed-kanab / tasleeh-kanab)
      area: optStr(), // المنطقة التي نُفّذ فيها العمل (مثال: الجهراء)
      price: opt(z.number()), // بالدينار الكويتي
      priceUnit: z.preprocess(blank, z.enum(['piece', 'meter']).default('meter')), // للقطعة أو للمتر الطولي
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

// مراجعات العملاء الحقيقية: تصل من نموذج «آراء العملاء» عبر واتساب، ويضيفها المالك من اللوحة.
// لا تُنشر إلا المراجعات المعتمدة (approved)، ولا تُكتب مراجعة بلا عميل حقيقي.
const reviews = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/reviews' }),
  schema: z.object({
    name: z.string(), // اسم العميل كما كتبه
    rating: z.number().int().min(1).max(5),
    text: z.string(),
    product: optStr(), // اسم ملف المنتج (رابطه) إن كانت المراجعة عن منتج محدد
    area: optStr(), // منطقة العميل (اختياري)
    date: z.coerce.date(),
    approved: z.boolean().default(true),
  }),
});

export const collections = { products, categories, services, reviews };
