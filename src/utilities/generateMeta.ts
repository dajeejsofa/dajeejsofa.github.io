import type { Metadata } from 'next'

import type { Page, Product } from '../payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'
import { business } from '@/lib/business'

export const generateMeta = async (args: {
  doc: Page | Product | null
  /** مسار الصفحة، مثل '/' أو '/tanjeed-kanab' */
  path: string
}): Promise<Metadata> => {
  const { doc, path } = args
  const url = `${getServerSideURL()}${path}`

  const ogImage =
    typeof doc?.meta?.image === 'object' &&
    doc.meta.image !== null &&
    'url' in doc.meta.image &&
    `${getServerSideURL()}${doc.meta.image.url}`

  const title = doc?.meta?.title || (doc?.title ? `${doc.title} | ${business.nameAr}` : business.nameAr)
  const description = doc?.meta?.description || business.descriptionAr

  return {
    alternates: { canonical: url },
    description,
    openGraph: mergeOpenGraph({
      description,
      images: ogImage ? [{ url: ogImage }] : undefined,
      title,
      url,
    }),
    title,
  }
}
