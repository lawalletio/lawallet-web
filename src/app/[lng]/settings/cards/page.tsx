'use client';

import { useTranslations } from 'next-intl';

import Navbar from '@/components/Layout/Navbar';
import { useCardsContext } from '@/context/CardsContext';
import { useNotifications } from '@/context/NotificationsContext';
import { Design } from '@lawallet/react/types';
import { Container, Divider, Flex, Loader } from '@lawallet/ui';
import AddNewCardModal from './components/AddCard';
import DebitCard from './components/DebitCard';
import EmptyCards from './components/EmptyCards';

export default function Page() {
  const notifications = useNotifications();
  const { cardsData, cardsConfig, loadInfo, toggleCardStatus } = useCardsContext();

  const t = useTranslations();

  const handleToggleStatus = async (uuid: string) => {
    const toggled: boolean = await toggleCardStatus(uuid);
    if (toggled)
      notifications.showAlert({
        title: '',
        description: t('TOGGLE_STATUS_CARD_SUCCESS'),
        type: 'success',
      });

    return toggled;
  };

  return (
    <>
      <Navbar title={t('MY_CARDS')} showBackPage={true} overrideBack={'/settings'} />

      <Container size="small">
        <Divider y={16} />
        {loadInfo.loading ? (
          <Loader />
        ) : Object.keys(cardsData).length ? (
          <Flex direction="column" align="center" gap={16}>
            {Object.entries(cardsData).map(([key, value]) => {
              return (
                <DebitCard
                  card={{
                    uuid: key,
                    data: value as { design: Design },
                    config: cardsConfig.cards?.[key],
                  }}
                  toggleCardStatus={handleToggleStatus}
                  key={key}
                />
              );
            })}
          </Flex>
        ) : (
          <EmptyCards />
        )}
        <Divider y={16} />
      </Container>

      <AddNewCardModal />
    </>
  );
}
