'use client';
import { CardConfigReturns, useCards, useConfig } from '@lawallet/react';
import { NostrEvent } from '@nostr-dev-kit/ndk';
import { createContext, useContext, useEffect, useState } from 'react';
import { useNotifications } from './NotificationsContext';
import { useTranslations } from 'next-intl';

interface CardContextType extends CardConfigReturns {
  encodeDonationEvent: (uuid: string) => Promise<string | undefined>;
}

const CardsContext = createContext({} as CardContextType);

export function CardsProvider(props: React.PropsWithChildren) {
  const { children } = props;

  const [cardToDonate, setCardToDonate] = useState<string>('');
  const config = useConfig();

  const cards = useCards({
    config,
  });

  const notifications = useNotifications();
  const t = useTranslations();

  const notifyCardDonation = () => {
    notifications.showAlert({
      title: '',
      description: t('DONATION_CARD_SUCCESS'),
      type: 'success',
    });
  };

  const encodeDonationEvent = async (uuid: string) => {
    const donationEvent: NostrEvent | undefined = await cards.buildDonationEvent(uuid);
    if (!donationEvent) return;

    const encodedDonationEvent: string = btoa(JSON.stringify(donationEvent))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    setCardToDonate(uuid);
    return encodedDonationEvent;
  };

  useEffect(() => {
    if (cardToDonate) {
      const existCard = cards.cardsData[cardToDonate];
      if (!existCard) {
        notifyCardDonation();
        setCardToDonate('');
      }
    }
  }, [cards.cardsData, cardToDonate]);

  const value: CardContextType = {
    ...cards,
    encodeDonationEvent,
  };

  return <CardsContext.Provider value={value}>{children}</CardsContext.Provider>;
}

export const useCardsContext = () => {
  const context = useContext(CardsContext);
  if (!context) {
    throw new Error('useCardsContext must be used within CardsProvider');
  }

  return context;
};
