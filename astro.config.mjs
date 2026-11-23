// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// صفحة /shop/ تُنشر noindex ما دام لا يوجد منتج منشور، فتُستبعد من sitemap أيضًا
const productsDir = fileURLToPath(new URL('./src/content/products/', import.meta.url));
const hasProducts = existsSync(productsDir) && readdirSync(productsDir)
  .filter((f) => f.endsWith('.md'))
  .some((f) => !/^draft:\s*true\s*$/m.test(readFileSync(productsDir + f, 'utf8')));

// عنوان الموقع النهائي في مكان واحد.
// بعد شراء الدومين وربطه: غيّره إلى 'https://dajeejsofa.com' وأضف public/CNAME.
// المقالات المجدولة: صفحة /blog/ تبقى noindex وخارج sitemap حتى يحين موعد أول مقال (بتوقيت الكويت)
const blogDir = fileURLToPath(new URL('./src/content/blog/', import.meta.url));
const todayKw = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kuwait', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
const hasPosts = existsSync(blogDir) && readdirSync(blogDir).filter((f) => f.endsWith('.md')).some((f) => {
  const t = readFileSync(blogDir + f, 'utf8');
  const d = t.match(/^pubDate:\s*['"]?(\d{4}-\d{2}-\d{2})/m)?.[1];
  return !/^draft:\s*true\s*$/m.test(t) && d && d <= todayKw;
});

export const SITE = 'https://dajeejsofa.com';

export default defineConfig({
  site: SITE,
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'always' },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/admin/') && !page.includes('/404') && (hasProducts || !page.endsWith('/shop/')) && (hasPosts || !page.endsWith('/blog/')),
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});
