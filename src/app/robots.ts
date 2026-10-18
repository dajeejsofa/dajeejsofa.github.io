/* eslint-disable no-restricted-exports */
import type { MetadataRoute } from 'next'
import { getServerSideURL } from '@/utilities/getURL'

// زواحف محركات البحث وأدوات الذكاء الاصطناعي مسموح لها صراحةً
const aiAndSearchBots = [
  'Googlebot',
  'Bingbot',
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'PerplexityBot',
  'Google-Extended',
  'Applebot',
]

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getServerSideURL()
  return {
    host: baseUrl,
    rules: [
      ...aiAndSearchBots.map((userAgent) => ({
        userAgent,
        allow: '/',
        disallow: ['/admin', '/api', '/next'],
      })),
      { userAgent: '*', allow: '/', disallow: ['/admin', '/api', '/next'] },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
