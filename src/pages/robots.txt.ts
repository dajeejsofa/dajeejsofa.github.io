import type { APIRoute } from 'astro';

// محركات البحث وأدوات الذكاء الاصطناعي مسموح لها صراحةً؛ لوحة التحكم مستبعدة
const bots = ['Googlebot', 'Bingbot', 'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'PerplexityBot', 'Google-Extended', 'Applebot'];

export const GET: APIRoute = ({ site }) => {
  const rules = [...bots, '*'].map((ua) => `User-agent: ${ua}\nAllow: /\nDisallow: /admin/\n`).join('\n');
  return new Response(`${rules}\nSitemap: ${new URL('/sitemap-index.xml', site)}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
