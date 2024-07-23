import AppProvider from '@/components/AppProvider/AppProvider';
import { fontPrimary, fontSecondary } from '@/config/exports/fonts';
import { APP_NAME } from '@/utils/constants';
import { AvailableLanguages } from '@lawallet/react/types';
import { NextIntlClientProvider, useMessages } from 'next-intl';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import Script from 'next/script';
import { ReactNode } from 'react';

interface ProviderProps {
  children: ReactNode;
  params: { lng: AvailableLanguages };
}

// Metadata
const APP_DESCRIPTION = 'https://lawallet.ar/';

export async function generateMetadata({ params: { lng } }) {
  const t = await getTranslations({ locale: lng, namespace: 'metadata' });

  return {
    title: `${t('HOME_TITLE')} - ${APP_NAME}`,
  };
}

const Providers = (props: ProviderProps) => {
  const { children, params } = props;

  unstable_setRequestLocale(params.lng);
  const messages = useMessages();

  return (
    <html lang={params.lng} className={`${fontPrimary.variable} ${fontSecondary.variable}`}>
      <head>
        <title>{APP_NAME}</title>
        <meta name="application-name" content={APP_NAME} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content={APP_NAME} />
        <meta name="description" content={APP_DESCRIPTION} />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#1C1C1C" />
        {/* TIP: set viewport head meta tag in _app.js, otherwise it will show a warning */}
        {/* <meta
          name='viewport'
          content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover'
        /> */}

        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="/favicon.ico" />

        {/* Fonts */}
        {/* <link rel="preload" href="/fonts/IAAB3.woff2" as="font" type="font/woff2" />
        <link rel="preload" href="/fonts/SF-Regular.woff2" as="font" type="font/woff2" />
        <link rel="preload" href="/fonts/SF-Bold.woff2" as="font" type="font/woff2" /> */}

        <Script src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_TAG_ID}`} />
        <Script id="google-analytics">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
        
          gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_TAG_ID}');
        `}
        </Script>
      </head>

      <body>
        <NextIntlClientProvider locale={params.lng} messages={messages}>
          <AppProvider>{children}</AppProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
};

export default Providers;
