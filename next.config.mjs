/** @type {import('next').NextConfig} */

import createNextIntlPlugin from 'next-intl/plugin';
import withSerwistInit from '@serwist/next';

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');
const { version } = require('./package.json');

const withSerwist = withSerwistInit({
  swSrc: 'src/utils/sw.ts',
  swDest: 'public/sw.js',
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig = {
  reactStrictMode: false,
  trailingSlash: true,
  swcMinify: true,
  transpilePackages: ['@lawallet/react', '@lawallet/utils', '@lawallet/ui'],
  compiler: {
    styledComponents: true,
  },
  env: {
    version,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
      },
    ],
  },
};

export default withNextIntl(withSerwist(nextConfig));
