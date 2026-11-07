import type { Config, Context } from "@netlify/functions";
import { getStore } from "@netlify/blobs";

// يستقبل مراجعات العملاء لموقعين ويحفظ كل موقع في مجلد مستقل:
// dajeejsofa.com ← pending/ (بانتظار موافقة المالك)، وalamcurtainskw.com ← alam/ (تُنشر مباشرة).
// GitHub Actions في مستودع كل موقع يسحب مراجعاته دوريًا (?site=alam لموقع الستائر).

const SITES: Record<string, string> = {
  "https://dajeejsofa.com": "pending/",
  "https://www.dajeejsofa.com": "pending/",
  "https://alamcurtainskw.com": "alam/",
  "https://www.alamcurtainskw.com": "alam/",
};
const ORIGINS = Object.keys(SITES);
const cors = (req: Request) => {
  const o = req.headers.get("origin") || "";
  return {
    "Access-Control-Allow-Origin": ORIGINS.includes(o) ? o : ORIGINS[0],
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "content-type",
    Vary: "Origin",
  };
};
const json = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json; charset=utf-8", ...headers } });

const clean = (v: unknown, max: number) =>
  typeof v === "string" ? v.replace(/[\u0000-\u001f\u007f<>]/g, " ").replace(/\s+/g, " ").trim().slice(0, max) : "";

const store = () => getStore({ name: "reviews", consistency: "strong" });

export default async (req: Request, context: Context) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(req) });

  if (req.method === "POST") {
    const h = cors(req);
    let b: Record<string, unknown>;
    try { b = await req.json(); } catch { return json({ ok: false, error: "bad_json" }, 400, h); }
    if (clean(b.website, 100)) return json({ ok: true }, 200, h); // حقل فخ للروبوتات
    const rating = Number(b.rating);
    const name = clean(b.name, 40);
    const text = clean(b.text, 600);
    const area = clean(b.area, 30);
    const product = clean(b.product, 120);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5 || name.length < 2 || text.length < 10)
      return json({ ok: false, error: "invalid" }, 400, h);
    if (product && !/^[a-z0-9-]+$/.test(product)) return json({ ok: false, error: "invalid" }, 400, h);
    // روابط وأرقام هواتف وحسابات = إعلانات وسبام (مهم لموقع الستائر لأن النشر فيه تلقائي)
    const spam = /(https?:\/\/|www\.|\.(com|net|org|xyz|link|shop|ru)\b|@[a-z0-9_]{3,}|\d{7,})/i;
    if (spam.test(name) || spam.test(text) || spam.test(area)) return json({ ok: false, error: "invalid" }, 400, h);
    const prefix = SITES[req.headers.get("origin") || ""] || "pending/";
    const id = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
    await store().setJSON(`${prefix}${id}`, { id, name, rating, text, area, product, date: new Date().toISOString().slice(0, 10), country: context.geo?.country?.code || "" });
    return json({ ok: true }, 200, h);
  }

  // الاستيراد: GitHub Actions يقرأ المراجعات الواردة آخر 14 يومًا (وهي مكتوبة أصلًا للنشر)،
  // ويتجاهل ما سبق استيراده. الأقدم من 14 يومًا يُحذف تلقائيًا.
  if (req.method === "GET") {
    const s = store();
    const prefix = new URL(req.url).searchParams.get("site") === "alam" ? "alam/" : "pending/";
    const { blobs } = await s.list({ prefix });
    const cutoff = Date.now() - 14 * 24 * 3600 * 1000;
    const items = [];
    for (const bl of blobs) {
      const ts = Number(bl.key.slice(prefix.length).split("-")[0]);
      if (!ts || ts < cutoff) { await s.delete(bl.key); continue; }
      const v = await s.get(bl.key, { type: "json" });
      if (v) items.push(v);
    }
    return json({ ok: true, items }, 200, { "cache-control": "no-store" });
  }
  return json({ ok: false }, 405);
};

export const config: Config = {
  path: "/api/review",
  rateLimit: { windowLimit: 10, windowSize: 60, aggregateBy: ["ip", "domain"] },
};
