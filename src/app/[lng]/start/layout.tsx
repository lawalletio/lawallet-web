import { APP_NAME } from '@/utils/constants';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params: { lng } }) {
  const t = await getTranslations({ locale: lng, namespace: 'metadata' });

  return {
    title: `${t('SIGNUP_TITLE')} - ${APP_NAME}`,
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
