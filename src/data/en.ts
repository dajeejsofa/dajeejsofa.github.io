/**
 * محتوى الصفحات الإنجليزية تحت /en/. كل صفحة إنجليزية تقابل صفحة عربية (ar) وتُربط بها بـ hreflang.
 * الأسعار لا تُكتب هنا أبدًا: تُحسب عند البناء من المنتجات المنشورة، فلا تختلف عن الصفحة العربية.
 */
export interface EnPage {
  slug: string; // الرابط الإنجليزي: /en/{slug}/
  ar: string; // اسم الصفحة العربية المقابلة (خدمة أو قسم)
  kind: 'service' | 'category';
  name: string; // الاسم في القوائم
  title: string; // عنوان جوجل (بدون السعر؛ السعر يُضاف تلقائيًا)
  h1: string;
  intro: string;
  points: string[];
}

export const enPages: EnPage[] = [
  {
    slug: 'custom-sofas',
    ar: 'tafseel-kanab',
    kind: 'service',
    name: 'Custom sofas',
    title: 'Custom Sofas in Kuwait, Made to Measure',
    h1: 'Custom sofas made to measure in Kuwait',
    intro:
      'We make sofas to the measurements of your room in our workshop in Katara Complex, Al Dajeej. Every price is per linear metre with the fabric included, so the cost follows directly from the length of your walls.',
    points: [
      'Corner sofas in L and U shapes, with a chaise end or separate pieces.',
      'Diwaniya sofas on one, two or three walls.',
      'Modern sofas, American-style sofas and classic sofas with a wooden frame.',
      'Sofa sets for the living room, sofa beds and Arabic majlis floor seating.',
      'Single armchairs are priced on agreement.',
    ],
  },
  {
    slug: 'sofa-upholstery',
    ar: 'tanjeed-kanab',
    kind: 'service',
    name: 'Sofa upholstery',
    title: 'Sofa Upholstery in Kuwait',
    h1: 'Sofa upholstery in Kuwait',
    intro:
      'We reupholster old sofas with new fabric in our workshop in Katara Complex, Al Dajeej. The price is per linear metre of sofa, fabric included.',
    points: [
      'Corner sofas in L and U shapes.',
      'Diwaniya sofas with a wooden base and armrests.',
      'Complete sofa sets.',
      'Modern sofas with wooden or metal legs.',
      'Upholstery of single armchairs is priced on agreement.',
    ],
  },
  {
    slug: 'sofa-repair',
    ar: 'tasleeh-kanab',
    kind: 'service',
    name: 'Sofa repair',
    title: 'Sofa Repair in Kuwait — Sofa Legs and Foam',
    h1: 'Sofa repair in Kuwait: sofa legs and foam',
    intro:
      'Our sofa repair service covers two jobs, both done in our workshop in Katara Complex, Al Dajeej: repairing or replacing sofa legs, and repairing or replacing the foam when the seat has sunk.',
    points: [
      'Sofa leg repair or replacement.',
      'Foam repair or replacement with new foam.',
      'If the fabric is worn, sofa upholstery with new fabric is the better choice.',
    ],
  },
  {
    slug: 'corner-sofas',
    ar: 'kanab-zawiya',
    kind: 'category',
    name: 'Corner sofas',
    title: 'Corner Sofas in Kuwait, L and U Shape',
    h1: 'Corner sofas in Kuwait — L and U shape, made to measure',
    intro:
      'A corner sofa uses the corner of the living room or diwaniya and seats more people in less space. We make it to the length of your two walls, priced per linear metre with the fabric included.',
    points: ['Modern corner sofas with wooden or metal legs.', 'L-shape sofas with a chaise end.', 'U-shape sofas on three walls.', 'Modular corner sofas in separate pieces.', 'Small corner sofas for small rooms.'],
  },
  {
    slug: 'diwaniya-sofas',
    ar: 'kanab-diwaniya',
    kind: 'category',
    name: 'Diwaniya sofas',
    title: 'Diwaniya Sofas in Kuwait',
    h1: 'Diwaniya sofas in Kuwait, made to measure',
    intro:
      'We make diwaniya sofas to the length of your walls, on one, two or three sides, priced per linear metre with the fabric included.',
    points: ['Formal diwaniya sofas with a beech wood frame.', 'Diwaniya sofas with a capitonné (buttoned) back.', 'Modern diwaniya sofas with a wooden base.', 'Diwaniya seating with curved ends and side tables between the pieces.'],
  },
  {
    slug: 'modern-sofas',
    ar: 'kanab-modern',
    kind: 'category',
    name: 'Modern sofas',
    title: 'Modern Sofas in Kuwait',
    h1: 'Modern sofas in Kuwait, made to measure',
    intro: 'Modern sofas with simple lines, made to the size of your room in our workshop, priced per linear metre with the fabric included.',
    points: ['Modular modern sofas with rounded ends.', 'Curved and oval modern sofas.', 'Modern sofas with wooden or metal legs.', 'Modern sofas with vertical stitching on the back and seat.'],
  },
  {
    slug: 'sofa-sets',
    ar: 'atqam-kanab',
    kind: 'category',
    name: 'Sofa sets',
    title: 'Sofa Sets in Kuwait',
    h1: 'Sofa sets for the living room in Kuwait',
    intro:
      'A sofa set combines a long sofa and side sofas in one matching design. We make it to the size of your living room and the number of pieces you need, priced per linear metre with the fabric included. Single armchairs in the set are priced on agreement.',
    points: ['Tell us the size of the room and the number of pieces on WhatsApp.'],
  },
  {
    slug: 'arabic-majlis',
    ar: 'majalis-arabiya',
    kind: 'category',
    name: 'Arabic majlis',
    title: 'Arabic Majlis Seating in Kuwait',
    h1: 'Arabic majlis and floor seating in Kuwait',
    intro:
      'Arabic majlis seating is low, comfortable seating for majlis rooms and diwaniyas. We make it to the size of your room, on one or three walls, priced per linear metre with the fabric included.',
    points: ['Modern majlis seating with cylindrical cushions.', 'Floor majlis seating in two colours with wooden dividers.', 'Wooden cubes and boxes between the pieces are priced separately on agreement.'],
  },
  {
    slug: 'classic-sofas',
    ar: 'kanab-classic',
    kind: 'category',
    name: 'Classic sofas',
    title: 'Classic Sofas in Kuwait',
    h1: 'Classic sofas in Kuwait, made to measure',
    intro: 'Classic sofas with a visible wooden frame, made to the size of your room, priced per linear metre with the fabric included. Single armchairs are priced on agreement.',
    points: [],
  },
  {
    slug: 'american-sofas',
    ar: 'kanab-amriki',
    kind: 'category',
    name: 'American sofas',
    title: 'American Sofas in Kuwait',
    h1: 'American-style sofas in Kuwait, made to measure',
    intro: 'American-style sofas have a wide, deep seat and full armrests, made to your length in our workshop and priced per linear metre with the fabric included.',
    points: [],
  },
];

/** ساعات العمل بالإنجليزية من صيغة schema.org في لوحة التحكم (مثل Mo-Su 08:00-21:00) */
export const hoursEn = (spec: string[]) => {
  const t = (h: string, m: string) => {
    const n = Number(h);
    const suffix = n < 12 || n === 24 ? 'AM' : 'PM';
    const h12 = n % 12 === 0 ? 12 : n % 12;
    return `${h12}${m === '00' ? '' : `:${m}`} ${suffix}`;
  };
  const one = spec.length === 1 ? spec[0].match(/^Mo-Su (\d\d):(\d\d)-(\d\d):(\d\d)$/) : null;
  if (one) return `Open daily, ${t(one[1], one[2])} – ${t(one[3], one[4])}`;
  return spec.length ? `Opening hours: ${spec.join(', ')}` : '';
};
