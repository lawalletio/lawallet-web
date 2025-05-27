'use client';

import { appTheme, config } from '@/config/exports';
import { NotificationsProvider } from '@/context/NotificationsContext';
import { LaWalletProvider } from '@lawallet/react';
import { NextProvider } from '@lawallet/ui/next';
import AuthProvider from './AuthProvider';
import PullRefreshProvider from './PullRefreshProvider';

export default function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <PullRefreshProvider>
      <NextProvider theme={appTheme}>
        <LaWalletProvider config={config}>
          <AuthProvider>
            <NotificationsProvider>{children}</NotificationsProvider>
          </AuthProvider>
        </LaWalletProvider>
      </NextProvider>
    </PullRefreshProvider>
  );
}
