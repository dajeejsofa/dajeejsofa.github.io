/** السعر بالدينار الكويتي بثلاث خانات عشرية وأرقام لاتينية، مثال: 250.000 د.ك */
export type PriceUnit = 'piece' | 'meter';

export const unitLabel = (unit: PriceUnit) => (unit === 'meter' ? ' / المتر' : '');

export const formatKWD = (value: number) =>
  `${value.toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 })} د.ك`;
