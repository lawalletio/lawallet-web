import localFont from 'next/font/local';

const fontPrimary = localFont({
  variable: '--font-primary',
  src: [
    {
      path: './assets/IAAB3.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
});

const fontSecondary = localFont({
  variable: '--font-secondary',
  src: [
    {
      path: './assets/SF-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './assets/SF-Bold.woff2',
      weight: '700',
      style: 'bold',
    },
  ],
});

export { fontPrimary, fontSecondary };
