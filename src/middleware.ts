import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/config';

export default createMiddleware(routing);

export const config = {
  matcher: [
    '/((?!_next|api|favicon.ico|robots.txt|manifest.json|sw.js|workbox-*.js|_next/static|icons/|media/|cards/|plugins/|fonts/).*)',
  ],
};
