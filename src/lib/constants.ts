export type SortFilterItem = {
  reverse: boolean
  slug: null | string
  title: string
}

export const defaultSort: SortFilterItem = {
  slug: null,
  reverse: false,
  title: 'أبجديًا',
}

export const sorting: SortFilterItem[] = [
  defaultSort,
  { slug: '-createdAt', reverse: true, title: 'الأحدث' },
  { slug: 'priceInKWD', reverse: false, title: 'السعر: من الأقل' }, // asc
  { slug: '-priceInKWD', reverse: true, title: 'السعر: من الأعلى' },
]
