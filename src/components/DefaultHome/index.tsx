import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import React from 'react'

import { Grid } from '@/components/Grid'
import { ProductGridItem } from '@/components/ProductGridItem'
import { WhatsAppIcon } from '@/components/icons/whatsapp'
import { business, fullAddressAr, whatsappLink } from '@/lib/business'
import { homeFaq } from './faq'

const services = [
  { title: 'كنب جاهز من المعرض', text: 'كنب وقنفات جاهزة بأسعار ظاهرة بالدينار الكويتي.' },
  { title: 'تفصيل كنب حسب المقاس', text: 'تفصيل قنفات حسب مقاس المكان في المشغل.' },
  { title: 'تنجيد وتلبيس الكنب', text: 'تنجيد وتلبيس الكنب والقنفات القديمة.' },
  { title: 'تصليح الكنب', text: 'تصليح الكنب والقنفات في المشغل.' },
]

export async function DefaultHome() {
  const payload = await getPayload({ config: configPromise })
  const products = await payload.find({
    collection: 'products',
    draft: false,
    limit: 8,
    overrideAccess: false,
    sort: '-createdAt',
    where: { _status: { equals: 'published' } },
    select: { title: true, slug: true, gallery: true, priceInKWD: true },
  })

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: homeFaq.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }

  return (
    <article className="container pt-12 pb-24">
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        type="application/ld+json"
      />

      <header className="max-w-3xl">
        <h1 className="text-3xl font-bold leading-snug md:text-4xl">
          قنفات وكنب في الكويت من معرضنا ومشغلنا بالضجيج
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-neutral-600 dark:text-neutral-300">
          {business.descriptionAr}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            className="rounded-md bg-black px-5 py-3 text-white dark:bg-white dark:text-black"
            href="/shop"
          >
            تصفح الكنب والقنفات
          </Link>
          <a
            className="inline-flex items-center gap-2 rounded-md bg-[#25D366] px-5 py-3 text-white"
            href={whatsappLink(`مرحبًا ${business.nameAr}، عندي استفسار عن الكنب.`)}
            rel="noopener noreferrer"
            target="_blank"
          >
            <WhatsAppIcon className="h-5 w-5" />
            اطلب عبر واتساب
          </a>
        </div>
      </header>

      <section className="mt-16">
        <h2 className="text-2xl font-bold">خدماتنا</h2>
        <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <li className="rounded-lg border p-5" key={service.title}>
              <h3 className="font-bold">{service.title}</h3>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">{service.text}</p>
            </li>
          ))}
        </ul>
      </section>

      {products.docs.length > 0 && (
        <section className="mt-16">
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-bold">أحدث الكنب والقنفات</h2>
            <Link className="text-sm underline" href="/shop">
              كل المنتجات
            </Link>
          </div>
          <Grid className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.docs.map((product) => (
              <ProductGridItem key={product.id} product={product} />
            ))}
          </Grid>
        </section>
      )}

      <section className="mt-16 rounded-lg border p-6">
        <h2 className="text-2xl font-bold">زورنا في المعرض</h2>
        <p className="mt-3 leading-relaxed">
          {business.unit ? `${business.unit}، ` : ''}
          {fullAddressAr}
        </p>
        <p className="mt-2">
          الهاتف وواتساب:{' '}
          <a className="font-medium" dir="ltr" href={`tel:+965${business.phone}`}>
            {business.phone}
          </a>
        </p>
        {business.mapUrl ? (
          <a className="mt-3 inline-block underline" href={business.mapUrl} rel="noopener noreferrer" target="_blank">
            الموقع على الخريطة
          </a>
        ) : null}
      </section>

      <section className="mt-16 max-w-3xl">
        <h2 className="text-2xl font-bold">أسئلة شائعة</h2>
        <dl className="mt-6 space-y-6">
          {homeFaq.map(({ q, a }) => (
            <div key={q}>
              <dt className="font-bold">{q}</dt>
              <dd className="mt-1 text-neutral-600 dark:text-neutral-300">{a}</dd>
            </div>
          ))}
        </dl>
      </section>
    </article>
  )
}
