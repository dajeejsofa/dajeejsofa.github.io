import { business } from './business';

export const waLink = (message?: string) =>
  `https://wa.me/${business.whatsapp}${message ? `?text=${encodeURIComponent(message)}` : ''}`;

export const waGeneral = () => waLink(`مرحبًا ${business.name}، عندي استفسار عن الكنب.`);
export const waService = (service: string) => waLink(`مرحبًا ${business.name}، أريد الاستفسار عن ${service}.`);
export const waProduct = (title: string, url: string) =>
  waLink(`مرحبًا ${business.name}، أريد الاستفسار عن:\n${title}\n${url}`);
