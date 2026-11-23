import { getCollection, type CollectionEntry } from 'astro:content';
import { isDue } from './catalog';

export type Post = CollectionEntry<'blog'>;

/** المقالات المنشورة فقط، الأحدث أولًا (المسودات والمجدولة لموعد قادم لا تظهر) */
export const publishedPosts = async () =>
  (await getCollection('blog', ({ data }) => !data.draft && isDue(data.pubDate))).sort(
    (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime(),
  );
