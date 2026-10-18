import type { Metadata } from 'next'
import { business } from '@/lib/business'
import { getServerSideURL } from '@/utilities/getURL'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'

const title = `كنب وقنفات في الكويت — ${business.nameAr}، معرض ومشغل`
const description =
  'معرض ومشغل كنب وقنفات في مجمع كتارا بالضجيج: كنب جاهز بأسعار بالدينار، تفصيل حسب المقاس، تنجيد وتلبيس وتصليح. اطلب عبر واتساب 65061072.'

export const homeMetadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: `${getServerSideURL()}/` },
  openGraph: mergeOpenGraph({ title, description, url: `${getServerSideURL()}/` }),
}
