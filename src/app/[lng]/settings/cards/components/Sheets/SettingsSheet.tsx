import { useTranslations } from 'next-intl';
import { ActionSheet, Button } from '@lawallet/ui';
import { useRouter } from '@/navigation';
import React, { useState } from 'react';
import { CardProps } from '../DebitCard';
import TransferSheet from './TransferSheet';

export type SettingsSheetProps = { isOpen: boolean; card: CardProps; onClose: () => void };

const SettingsSheet = ({ card, onClose, isOpen }: SettingsSheetProps) => {
  const t = useTranslations();
  const router = useRouter();
  const [showTransfer, setShowTransfer] = useState(false);

  const handleShowTransfer = () => {
    setShowTransfer(true);
  };

  return (
    <React.Fragment>
      <ActionSheet
        isOpen={isOpen}
        onClose={onClose}
        title={card.config?.name || card.data.design.name}
        description={card.config?.description || card.data.design.name}
        cancelText={t('CANCEL')}
      >
        <Button variant="bezeledGray" onClick={() => router.push(`/settings/cards/${card?.uuid}`)}>
          {t('SETTINGS')}
        </Button>
        <Button variant="bezeledGray" onClick={handleShowTransfer}>
          {t('TRANSFER')}
        </Button>
      </ActionSheet>

      <TransferSheet
        isOpen={showTransfer}
        card={card}
        onClose={() => {
          setShowTransfer(false);
          onClose();
        }}
      />
    </React.Fragment>
  );
};

export default SettingsSheet;
