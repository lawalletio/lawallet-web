import createMiddleware from 'next-intl/middleware';
import { defaultLocale, localePrefix, locales } from './i18n/config';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix,
});

export const config = {
  matcher: [
    '/((?!_next|api|favicon.ico|robots.txt|manifest.json|sw.js|workbox-*.js|_next/static|icons/|media/|cards/|plugins/|fonts/).*)',
  ],
};
