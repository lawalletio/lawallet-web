import PluginsEmptyView from '@/components/Layout/EmptyView/PluginsEmptyView';
import { APP_NAME } from '@/utils/constants';
import { getTranslations } from 'next-intl/server';
import React from 'react';
import pluginsConfig from '@/config/pluginsConfig.json';

export async function generateMetadata({ params: { lng } }) {
  const t = await getTranslations({ locale: lng, namespace: 'metadata' });

  return {
    title: `${t('PLUGINS_TITLE')} - ${APP_NAME}`,
  };
}

const pluginsEnabled: boolean = Boolean(pluginsConfig.enabled);

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  if (!pluginsEnabled) return <PluginsEmptyView />;

  return children;
};

export default RootLayout;
