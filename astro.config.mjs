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
export const SITE = 'https://dajeejsofa.com';

export default defineConfig({
  site: SITE,
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/admin/') && !page.includes('/404') && (hasProducts || !page.endsWith('/shop/')),
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});
