/**
 * بيانات النشاط في مكان واحد.
 * كل الصفحات والبيانات المنظمة وروابط واتساب تقرأ من هنا،
 * حتى يبقى الاسم والعنوان والهاتف متطابقًا في كل مكان.
 *
 * القيم الفارغة ('') معلومات لم تُحدَّد بعد — لا تُعرض في الموقع حتى تُعبّأ.
 */
export const business = {
  nameAr: 'قنفات الضجيج',
  nameEn: 'Dajeej Sofa',
  descriptionAr:
    'قنفات الضجيج معرض ومشغل كنب وقنفات في مجمع كتارا بالضجيج، الكويت. نبيع كنبًا جاهزًا من المعرض، ونفصّل الكنب حسب المقاس، وننجّد ونلبّس ونصلّح القنفات.',
  descriptionEn:
    'Dajeej Sofa is a sofa showroom and workshop in Katara Complex, Al Dajeej, Kuwait. We sell ready-made sofas, make custom sofas to measure, and reupholster and repair sofas.',
  phone: '65061072',
  /** رقم واتساب بالصيغة الدولية بدون + */
  whatsapp: '96565061072',
  address: {
    streetAr: 'مجمع كتارا',
    streetEn: 'Katara Complex',
    localityAr: 'الضجيج',
    localityEn: 'Al Dajeej',
    countryAr: 'الكويت',
    countryCode: 'KW',
  },
  /** يُعبّأ لاحقًا: رقم المحل/الطابق داخل المجمع */
  unit: '',
  /** يُعبّأ لاحقًا: رابط الموقع على الخريطة */
  mapUrl: '',
  /** يُعبّأ لاحقًا: الإحداثيات الدقيقة للمعرض */
  geo: null as null | { latitude: number; longitude: number },
  /** يُعبّأ لاحقًا: مثال ['Sa-Th 10:00-22:00'] بصيغة schema.org */
  openingHours: [] as string[],
  /** يُعبّأ لاحقًا: روابط إنستقرام وغيره */
  sameAs: [] as string[],
} as const

export const fullAddressAr = `${business.address.streetAr}، ${business.address.localityAr}، ${business.address.countryAr}`

export const whatsappLink = (message?: string) => {
  const base = `https://wa.me/${business.whatsapp}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}
