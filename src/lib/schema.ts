import type { Media, Product } from '@/payload-types'
import { business } from '@/lib/business'
import { KWD } from '@/lib/currency'
import { getServerSideURL } from '@/utilities/getURL'

const absolute = (path?: string | null) => {
  if (!path) return undefined
  return path.startsWith('http') ? path : `${getServerSideURL()}${path}`
}

const filsToKWD = (fils: number) => (fils / Math.pow(10, KWD.decimals)).toFixed(KWD.decimals)

/** بيانات المعرض كمتجر أثاث محلي — تظهر في كل الصفحات */
export const storeJsonLd = () => {
  const url = getServerSideURL()
  return {
    '@context': 'https://schema.org',
    '@type': 'FurnitureStore',
    '@id': `${url}/#store`,
    name: business.nameAr,
    alternateName: business.nameEn,
    description: business.descriptionAr,
    url,
    telephone: `+965${business.phone}`,
    priceRange: 'KWD',
    currenciesAccepted: 'KWD',
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.unit
        ? `${business.unit}، ${business.address.streetAr}`
        : business.address.streetAr,
      addressLocality: business.address.localityAr,
      addressCountry: business.address.countryCode,
    },
    areaServed: { '@type': 'Country', name: 'Kuwait' },
    ...(business.geo
      ? {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: business.geo.latitude,
            longitude: business.geo.longitude,
          },
        }
      : {}),
    ...(business.mapUrl ? { hasMap: business.mapUrl } : {}),
    ...(business.openingHours.length ? { openingHours: business.openingHours } : {}),
    ...(business.sameAs.length ? { sameAs: business.sameAs } : {}),
    makesOffer: [
      'بيع كنب وقنفات جاهزة',
      'تفصيل كنب حسب المقاس',
      'تنجيد وتلبيس الكنب',
      'تصليح الكنب',
    ].map((name) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name } })),
  }
}

type ProductSchemaArgs = {
  product: Product
  price?: number | null
  inStock: boolean
  image?: Media
}

export const productJsonLd = ({ product, price, inStock, image }: ProductSchemaArgs) => {
  const url = `${getServerSideURL()}/products/${product.slug}`
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    url,
    ...(product.meta?.description ? { description: product.meta.description } : {}),
    ...(image?.url ? { image: absolute(image.url) } : {}),
    brand: { '@type': 'Brand', name: business.nameAr },
    ...(typeof price === 'number' && price > 0
      ? {
          offers: {
            '@type': 'Offer',
            url,
            price: filsToKWD(price),
            priceCurrency: KWD.code,
            availability: inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            seller: { '@id': `${getServerSideURL()}/#store` },
          },
        }
      : {}),
  }
}
