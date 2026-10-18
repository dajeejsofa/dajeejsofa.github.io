import { Banner } from '@payloadcms/ui'
import React from 'react'

import './index.scss'

const baseClass = 'before-dashboard'

export const BeforeDashboard: React.FC = () => {
  return (
    <div className={baseClass}>
      <Banner className={`${baseClass}__banner`} type="success">
        <h4>أهلًا بك في لوحة تحكم قنفات الضجيج</h4>
      </Banner>
      <ul className={`${baseClass}__instructions`}>
        <li>أضف المنتجات من «Products» مع السعر بالدينار والصور الحقيقية.</li>
        <li>رتّب المنتجات في الأقسام من «Categories».</li>
        <li>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/">افتح الموقع</a> لمعاينة التغييرات.
        </li>
      </ul>
    </div>
  )
}
