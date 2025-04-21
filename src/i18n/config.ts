import { defineRouting } from 'next-intl/routing';

export const locales = ['es', 'en'];
export const defaultLocale = 'es';
export const localePrefix = 'never';

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix,
});
