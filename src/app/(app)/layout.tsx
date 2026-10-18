import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { WhatsAppFloat } from '@/components/WhatsAppFloat'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { business } from '@/lib/business'
import { storeJsonLd } from '@/lib/schema'
import { getServerSideURL } from '@/utilities/getURL'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import React from 'react'
import '@fontsource/ibm-plex-sans-arabic/400.css'
import '@fontsource/ibm-plex-sans-arabic/700.css'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  title: {
    default: business.nameAr,
    template: `%s`,
  },
  description: business.descriptionAr,
  applicationName: business.nameAr,
  openGraph: mergeOpenGraph(),
  robots: { index: true, follow: true },
  formatDetection: { telephone: true },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      className={[GeistSans.variable, GeistMono.variable].filter(Boolean).join(' ')}
      dir="rtl"
      lang="ar-KW"
      suppressHydrationWarning
    >
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <script
          dangerouslySetInnerHTML={{ __html: JSON.stringify(storeJsonLd()) }}
          type="application/ld+json"
        />
      </head>
      <body>
        <Providers>
          <AdminBar />
          <LivePreviewListener />

          <Header />
          <main>{children}</main>
          <Footer />
          <WhatsAppFloat />
        </Providers>
      </body>
    </html>
  )
}
