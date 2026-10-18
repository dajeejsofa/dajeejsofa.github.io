import type { CurrenciesConfig } from '@payloadcms/plugin-ecommerce/types'

/**
 * الدينار الكويتي: 3 خانات عشرية (1 دينار = 1000 فلس).
 * الأسعار تُخزّن في قاعدة البيانات بالفلس، والعرض يقسم على 1000.
 */
export const KWD = {
  code: 'KWD',
  decimals: 3,
  label: 'دينار كويتي',
  symbol: 'د.ك',
}

export const currenciesConfig: CurrenciesConfig = {
  defaultCurrency: 'KWD',
  supportedCurrencies: [KWD],
}

/** أرقام لاتينية مع تنسيق كويتي عربي، مثال: 125.000 د.ك */
export const PRICE_LOCALE = 'ar-KW-u-nu-latn'
