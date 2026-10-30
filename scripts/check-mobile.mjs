// فحص الجوال قبل النشر (30 أكتوبر 2026): يفتح كل صفحات dist بعرض 360 و390 بكسل
// ويفشل البناء إذا كانت أي صفحة أعرض من الشاشة (تمرير أفقي) أو كان زر/شريط واتساب خارج الشاشة.
// السبب: رأس الصفحة العربية كان أعرض من الجوال، فانزاحت الصفحة واختفى نصف زر واتساب.
// تشغيل محلي: npm run build && npm run check:mobile
import { readdirSync, statSync, createReadStream, existsSync } from 'node:fs';
import { join, extname, relative } from 'node:path';
import { createServer } from 'node:http';
import { chromium } from 'playwright';

const ROOT = 'dist';
const WIDTHS = [360, 390];
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.ico': 'image/x-icon' };

function pages(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (name === 'admin' || name === '_astro') continue;
      out.push(...pages(p));
    } else if (name === 'index.html') {
      out.push('/' + relative(ROOT, dir).split('\\').join('/') + (dir === ROOT ? '' : '/'));
    }
  }
  return out.map((p) => p.replace(/\/+/g, '/'));
}

const server = createServer((req, res) => {
  let p = join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, 'index.html');
  if (!existsSync(p)) return res.writeHead(404).end();
  res.writeHead(200, { 'content-type': TYPES[extname(p)] ?? 'application/octet-stream' });
  createReadStream(p).pipe(res);
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;

const list = pages(ROOT);
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const fails = [];
for (const width of WIDTHS) {
  const page = await (await browser.newContext({ viewport: { width, height: 800 }, isMobile: true })).newPage();
  for (const path of list) {
    await page.goto(base + path, { waitUntil: 'domcontentloaded' });
    const r = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      // على الجوال يظهر شريط التواصل (.wa-bar)، وعلى الشاشات الأكبر الزر الدائري (.wa-float)
      const vis = [...document.querySelectorAll('.wa-float, .wa-bar')].map((e) => e.getBoundingClientRect()).filter((q) => q.width > 0);
      const wa = vis[0];
      return {
        vw,
        sw: document.documentElement.scrollWidth,
        wa: wa ? { left: Math.round(wa.left), right: Math.round(wa.right), bottom: Math.round(wa.bottom) } : null,
        ih: innerHeight,
      };
    });
    if (r.sw > r.vw) fails.push(`${width}px ${path}: الصفحة أعرض من الشاشة (${r.sw} > ${r.vw})`);
    if (!r.wa) fails.push(`${width}px ${path}: زر/شريط واتساب غير ظاهر`);
    else if (r.wa.left < 0 || r.wa.right > r.vw || r.wa.bottom > r.ih)
      fails.push(`${width}px ${path}: زر واتساب خارج الشاشة ${JSON.stringify(r.wa)}`);
  }
}
await browser.close();
server.close();

if (fails.length) {
  console.error(`✗ فحص الجوال: ${fails.length} مشكلة`);
  for (const f of fails.slice(0, 40)) console.error('  - ' + f);
  process.exit(1);
}
console.log(`✓ فحص الجوال سليم على ${list.length} صفحة بعرض ${WIDTHS.join(' و')} بكسل`);
