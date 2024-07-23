/** @type {import('next').NextConfig} */

// const withPWA = require('@ducanh2912/next-pwa').default({
//   dest: 'public',
//   skipWaiting: true,
//   register: true
// })

const createNextIntlPlugin = require('next-intl/plugin');
const withNextIntl = createNextIntlPlugin();

const { version } = require('./package.json');

const withSerwist = require('@serwist/next').default({
  // Note: This is only an example. If you use Pages Router,
  // use something else that works, such as "service-worker/index.ts".
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
};

module.exports = withNextIntl(withSerwist(nextConfig));
