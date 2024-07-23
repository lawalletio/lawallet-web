'use client';
import { Modal } from '@/components/UI';
import { Button, Flex, Text } from '@lawallet/ui';
import { useTranslations } from 'next-intl';
// import { AlertTypes } from '@/hooks/useAlerts';
import { useNotifications } from '@/context/NotificationsContext';
import { AlertTypes } from '@/hooks/useAlerts';
import { usePathname, useRouter } from '@/navigation';
import { getUserStoragedKey } from '@/utils';
import { buildCardActivationEvent, useConfig } from '@lawallet/react';
import { requestCardActivation } from '@lawallet/react/actions';
import { NostrEvent } from '@nostr-dev-kit/ndk';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export type NewCard = {
  card: string;
  loading: boolean;
};

const defaultNewCard = {
  card: '',
  loading: false,
};

const AddNewCardModal = () => {
  const [newCardInfo, setNewCardInfo] = useState<NewCard>(defaultNewCard);

  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const config = useConfig();
  const notifications = useNotifications();

  const resetCardInfo = () => {
    setNewCardInfo(defaultNewCard);
    router.replace(pathname);
  };

  const sendNotification = (alertDescription: string, alertType: AlertTypes) => {
    notifications.showAlert({
      description: alertDescription,
      type: alertType,
    });

    resetCardInfo();
  };

  const handleActivateCard = async () => {
    if (newCardInfo.loading) return;
    setNewCardInfo({
      ...newCardInfo,
      loading: true,
    });

    try {
      const storagedKey: string = await getUserStoragedKey(config.storage);
      if (!storagedKey) {
        sendNotification(t('ACTIVATE_ERROR'), 'error');
        return;
      }

      const cardEvent: NostrEvent = await buildCardActivationEvent(newCardInfo.card, storagedKey, config);
      const cardActivated: boolean = await requestCardActivation(cardEvent, config);

      const description: string = cardActivated ? t('ACTIVATE_SUCCESS') : t('ACTIVATE_ERROR');
      const type: AlertTypes = cardActivated ? 'success' : 'error';

      sendNotification(description, type);
      return;
    } catch {
      sendNotification(t('ACTIVATE_ERROR'), 'error');
      return;
    }
  };

  useEffect(() => {
    const card: string = params.get('c') ?? '';

    setNewCardInfo({
      card,
      loading: false,
    });
  }, []);

  return (
    <Modal
      title={t('NEW_CARD')}
      isOpen={Boolean(newCardInfo.card.length)}
      onClose={() => router.push('/settings/cards')}
    >
      <Text>{t('DETECT_NEW_CARD')}</Text>
      <Flex direction="column" gap={4}>
        <Flex>
          <Button onClick={handleActivateCard}>{t('ACTIVATE_CARD')}</Button>
        </Flex>
        <Flex>
          <Button variant="borderless" onClick={resetCardInfo}>
            {t('CANCEL')}
          </Button>
        </Flex>
      </Flex>
    </Modal>
  );
};

export default AddNewCardModal;
