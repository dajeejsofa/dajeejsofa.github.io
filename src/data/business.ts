/**
 * بيانات النشاط في مكان واحد. كل الصفحات والبيانات المنظمة وروابط واتساب تقرأ من هنا،
 * فيبقى الاسم والعنوان والهاتف متطابقًا في كل مكان (مهم لجوجل وأدوات الذكاء الاصطناعي).
 * القيم الفارغة معلومات لم تُحدَّد بعد ولا تُعرض حتى تُعبّأ.
 */
import settings from './settings.json';

const sameAs = [settings.instagram, settings.tiktok].filter((u): u is string => Boolean(u && u.trim()));

export const business = {
  name: 'قنفات الضجيج',
  nameEn: 'Dajeej Sofa',
  description:
    'قنفات الضجيج معرض ومشغل كنب وقنفات في مجمع كتارا بالضجيج، الكويت. نبيع كنبًا جاهزًا من المعرض، ونفصّل الكنب حسب المقاس، وننجّد ونلبّس ونصلّح القنفات.',
  descriptionEn:
    'Dajeej Sofa is a sofa showroom and workshop in Katara Complex, Al Dajeej, Kuwait. We sell ready-made sofas, make custom sofas to measure, and reupholster and repair sofas.',
  phone: '65061072',
  whatsapp: '96565061072',
  street: 'مجمع كتارا',
  locality: 'الضجيج',
  country: 'الكويت',
  countryCode: 'KW',
  locale: 'ar_KW',
  // من لوحة التحكم ← «بيانات المعرض» (src/data/settings.json)
  unit: settings.unit.trim(), // رقم المحل/الطابق داخل المجمع
  mapUrl: settings.mapUrl.trim(),
  geo: null as null | { latitude: number; longitude: number },
  openingHours: (settings.openingHours as string[]).filter(Boolean), // صيغة schema.org مثل 'Sa-Th 10:00-22:00'
  openingHoursText: settings.openingHoursText.trim(),
  sameAs,
};

export const fullAddress = `${business.unit ? business.unit + '، ' : ''}${business.street}، ${business.locality}، ${business.country}`;

export const services = [
  { slug: 'tanjeed-kanab', title: 'تنجيد كنب', short: 'تنجيد وتلبيس الكنب والقنفات القديمة.' },
  { slug: 'tafseel-kanab', title: 'تفصيل كنب', short: 'تفصيل قنفات حسب مقاس المكان في المشغل.' },
  { slug: 'tasleeh-kanab', title: 'تصليح كنب', short: 'تصليح الكنب والقنفات في المشغل.' },
];
