import type { Footer } from '@/payload-types'

import { FooterMenu } from '@/components/Footer/menu'
import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React, { Suspense } from 'react'
import { business, fullAddressAr, whatsappLink } from '@/lib/business'

export async function Footer() {
  const footer: Footer = await getCachedGlobal('footer', 1)()
  const menu = footer.navItems || []
  const currentYear = new Date().getFullYear()
  const skeleton = 'w-full h-6 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700'

  return (
    <footer className="text-sm text-neutral-500 dark:text-neutral-400">
      <div className="container">
        <div className="flex w-full flex-col gap-6 border-t border-neutral-200 py-12 text-sm md:flex-row md:gap-12 dark:border-neutral-700">
          <div className="max-w-sm">
            <Link className="text-base font-bold text-black dark:text-white" href="/">
              {business.nameAr}
            </Link>
            <p className="mt-3 leading-relaxed">{business.descriptionAr}</p>
            <address className="mt-4 not-italic leading-relaxed">
              {business.unit ? `${business.unit}، ` : ''}
              {fullAddressAr}
              <br />
              <a className="text-black dark:text-white" dir="ltr" href={`tel:+965${business.phone}`}>
                {business.phone}
              </a>
              {' · '}
              <a
                className="text-black dark:text-white"
                href={whatsappLink()}
                rel="noopener noreferrer"
                target="_blank"
              >
                واتساب
              </a>
            </address>
          </div>
          <Suspense
            fallback={
              <div className="flex h-[188px] w-[200px] flex-col gap-2">
                <div className={skeleton} />
                <div className={skeleton} />
                <div className={skeleton} />
              </div>
            }
          >
            <FooterMenu menu={menu} />
          </Suspense>
          <div className="md:ms-auto flex flex-col gap-4 items-end">
            <ThemeSelector />
          </div>
        </div>
      </div>
      <div className="border-t border-neutral-200 py-6 text-sm dark:border-neutral-700">
        <div className="container mx-auto">
          <p>
            &copy; {currentYear} {business.nameAr}. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  )
}
