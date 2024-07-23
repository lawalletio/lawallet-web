import Countdown from '@/components/Countdown/Countdown';
import { QRCode } from '@/components/UI';
import { useCardsContext } from '@/context/CardsContext';
import { useTranslations } from 'next-intl';
import { ActionSheet, Button, Divider, Flex, Text } from '@lawallet/ui';
import { useState } from 'react';
import { SettingsSheetProps } from './SettingsSheet';

const defaultQRInfo = {
  value: '',
  visible: false,
};

const TransferSheet = ({ card, isOpen, onClose }: SettingsSheetProps) => {
  const t = useTranslations();
  const { encodeDonationEvent } = useCardsContext();

  const [qrInfo, setQrInfo] = useState(defaultQRInfo);

  const handleDonateCard = async () => {
    const encodedDonationEvent: string | undefined = await encodeDonationEvent(card.uuid);
    if (!encodedDonationEvent) return;

    const absoluteURL = window.location ? window.location.origin : 'https://app.lawallet.ar';

    setQrInfo({
      value: `${absoluteURL}/settings/cards/donation?event=${encodedDonationEvent}`,
      visible: true,
    });
  };

  const handleCloseSheet = () => {
    setQrInfo(defaultQRInfo);
    onClose();
  };

  return (
    <ActionSheet
      isOpen={isOpen}
      onClose={handleCloseSheet}
      title={t('TRANSFER')}
      cancelText={t('CANCEL')}
      description={
        qrInfo.visible
          ? t('SCAN_CODE_FOR_TRANSFER_CARD', {
              name: card.config?.name ?? card.data.design.name,
            })
          : t('CONFIRM_TRANSFER_CARD', {
              name: card.config?.name ?? card.data.design.name,
            })
      }
    >
      {qrInfo.visible ? (
        <Flex direction="column" align="center">
          <QRCode size={250} value={qrInfo.value} showCopy={false} />
          <Divider y={12} />
          <Flex flex={1} direction="column" justify="space-between" align="center">
            <Text size="small">{t('TIME_LEFT')}</Text>
            <Countdown seconds={180} />
          </Flex>
        </Flex>
      ) : (
        <Button color="secondary" variant="bezeledGray" onClick={handleDonateCard}>
          {t('CONFIRM')}
        </Button>
      )}
    </ActionSheet>
  );
};

export default TransferSheet;
