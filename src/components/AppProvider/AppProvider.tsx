'use client';

import { appTheme, config } from '@/config/exports';
import { NotificationsProvider } from '@/context/NotificationsContext';
import { LaWalletProvider } from '@lawallet/react';
import { NextProvider } from '@lawallet/ui/next';
import AuthProvider from './AuthProvider';

export default function AppProvider({ children }: { children: React.ReactNode }) {
  const proxy = typeof window !== 'undefined' ? `${window.location.origin}/api/proxy` : undefined;
  const configWithProxy = { ...config, endpoints: { ...config.endpoints, proxy } };

  return (
    <NextProvider theme={appTheme}>
      <LaWalletProvider config={configWithProxy}>
        <AuthProvider>
          <NotificationsProvider>{children}</NotificationsProvider>
        </AuthProvider>
      </LaWalletProvider>
    </NextProvider>
  );
}
