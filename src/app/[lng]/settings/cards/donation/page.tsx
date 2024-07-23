'use client';
import Countdown from '@/components/Countdown/Countdown';
import Navbar from '@/components/Layout/Navbar';
import { Modal } from '@/components/UI';
import { useNotifications } from '@/context/NotificationsContext';
import { getUserStoragedKey } from '@/utils';
import { buildCardTransferAcceptEvent, nowInSeconds, useConfig, useIdentity } from '@lawallet/react';
import { requestCardActivation } from '@lawallet/react/actions';
import { Button, Flex, Text } from '@lawallet/ui';
import { NostrEvent } from '@nostr-dev-kit/ndk';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type EventDonationInfo = {
  event: NostrEvent | undefined;
  timeLeft: number;
  encoded: string;
};

const page = () => {
  const [eventInfo, setEventInfo] = useState<EventDonationInfo>({
    event: undefined,
    timeLeft: 0,
    encoded: '',
  });
  const t = useTranslations();

  const config = useConfig();
  const notifications = useNotifications();
  const router = useRouter();
  const params = useSearchParams();
  const identity = useIdentity();

  const handleAcceptCardTransfer = async () => {
    try {
      const event: NostrEvent = JSON.parse(atob(eventInfo.encoded));

      const storagedKey = await getUserStoragedKey(config.storage);
      if (!storagedKey) return;

      const buildedEvent: NostrEvent = await buildCardTransferAcceptEvent(event.pubkey, event, storagedKey);
      const res = await requestCardActivation(buildedEvent);

      if (!res) throw new Error();

      notifications.showAlert({
        title: '',
        description: t('ACTIVATE_SUCCESS'),
        type: 'success',
      });

      router.push('/settings/cards');
      return;
    } catch {
      notifications.showAlert({
        title: '',
        description: t('ACTIVATE_ERROR'),
        type: 'error',
      });

      return;
    }
  };

  useEffect(() => {
    const encodedEvent: string = params.get('event') ?? '';
    if (!encodedEvent || !identity.signer) return;

    try {
      const event: NostrEvent = JSON.parse(atob(encodedEvent));
      if (event) {
        const timeLeft = 180 - (nowInSeconds() - event.created_at);
        if (timeLeft <= 0) {
          throw Error('Expired event');
        }

        setEventInfo({
          event,
          timeLeft,
          encoded: encodedEvent,
        });
      }
    } catch {
      router.push('/settings/cards');
    }
  }, [identity.signer]);

  return (
    <>
      <Navbar showBackPage={true} title={'Recibir tarjeta'} overrideBack="/settings/cards" />

      <Modal
        title={t('NEW_CARD')}
        isOpen={Boolean(eventInfo.encoded.length)}
        onClose={() => router.push('/settings/cards')}
      >
        <Text>{t('DETECT_NEW_CARD')}</Text>
        <Flex flex={1} direction="column" align="center" justify="center" gap={8}>
          <Text>{t('TIME_LEFT')}</Text>
          {eventInfo.event && <Countdown seconds={eventInfo.timeLeft} />}
        </Flex>
        <Flex direction="column" gap={4}>
          <Flex>
            <Button onClick={handleAcceptCardTransfer}>{t('ACTIVATE_CARD')}</Button>
          </Flex>
          <Flex>
            <Button variant="borderless" onClick={() => router.push('/settings/cards')}>
              {t('CANCEL')}
            </Button>
          </Flex>
        </Flex>
      </Modal>
    </>
  );
};

export default page;
