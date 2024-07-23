import useAlert, { UseAlertReturns } from '@/hooks/useAlerts';
import { useTransactions } from '@lawallet/react';
import { TransactionDirection } from '@lawallet/react/types';
import { Alert } from '@lawallet/ui';
import { differenceInSeconds } from 'date-fns';
import { useTranslations } from 'next-intl';
import React, { createContext, useContext, useEffect } from 'react';

const NotificationsContext = createContext({} as UseAlertReturns);

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const t = useTranslations();
  const notifications = useAlert();
  const transactions = useTransactions();

  useEffect(() => {
    if (transactions.length) {
      const lastTransaction = transactions[0];

      if (lastTransaction.direction === TransactionDirection.INCOMING) {
        const secondsSinceCreated: number = differenceInSeconds(new Date(), new Date(lastTransaction.createdAt));

        if (secondsSinceCreated < 5)
          notifications.showAlert({
            description: t('TRANSACTION_RECEIVED', {
              sats: (lastTransaction.tokens.BTC / 1000).toString(),
            }),
            type: 'success',
          });
      }
    }
  }, [transactions.length]);

  return (
    <NotificationsContext.Provider value={notifications}>
      <Alert
        title={notifications.alert?.title}
        description={notifications.alert?.description ?? ''}
        type={notifications.alert?.type}
        isOpen={!!notifications.alert}
      />
      {children}
    </NotificationsContext.Provider>
  );
}

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationsProvider');
  }

  return context;
};
