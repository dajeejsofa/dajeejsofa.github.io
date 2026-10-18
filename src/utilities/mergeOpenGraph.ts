import type { Metadata } from 'next'
import { business } from '@/lib/business'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  locale: 'ar_KW',
  description: business.descriptionAr,
  siteName: business.nameAr,
  title: business.nameAr,
}

export const mergeOpenGraph = (og?: Partial<Metadata['openGraph']>): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
