'use client';

import Navbar from '@/components/Layout/Navbar';
import { Modal } from '@/components/UI';
import QrScanner from '@/components/UI/Scanner/Scanner';
import { useRouter } from '@/navigation';
import { regexURL } from '@/utils/constants';
import {
  LaWalletTags,
  detectTransferType,
  getMultipleTagsValues,
  getTagValue,
  removeLightningStandard,
  useConfig,
} from '@lawallet/react';
import { TransferTypes } from '@lawallet/react/types';
import { Button, Flex, Text } from '@lawallet/ui';
import { NostrEvent } from '@nostr-dev-kit/ndk';
import { useTranslations } from 'next-intl';
import NimiqQrScanner from 'qr-scanner';
import { useState } from 'react';

export default function Page() {
  const [urlScanned, setUrlScanned] = useState<string>('');
  const t = useTranslations();
  const router = useRouter();
  const config = useConfig();

  const processExternalURL = (str: string) => {
    const url = new URL(str);
    const eventParameter = url.searchParams.get('event');

    if (!eventParameter) {
      setUrlScanned(str);
      return;
    }

    const event: NostrEvent = JSON.parse(atob(eventParameter));
    if (event) {
      const subkindValue: string = getTagValue(event.tags, 't');
      const pValues: string[] = getMultipleTagsValues(event.tags, 'p');

      if (subkindValue === LaWalletTags.CARD_TRANSFER_DONATION && pValues.includes(config.modulePubkeys.card)) {
        router.push(`${window.location.origin}/settings/cards/donation?event=${eventParameter}`);
        return;
      } else {
        setUrlScanned(str);
      }
    }
  };

  const handleOpenUrl = () => {
    if (typeof window === 'undefined') return;

    window.open(urlScanned);
  };

  const handleScanURL = (str: string) => {
    const url = new URL(str);
    const originURL = window.location.origin;
    const eventParameter = url.searchParams.get('event');
    const cardParameter = url.searchParams.get('c');

    if (eventParameter) {
      // TODO: check federation
      router.push(`/settings/cards/donation?event=${eventParameter}`);
    } else if (cardParameter) {
      router.push(`/settings/cards?c=${cardParameter}`);
      return;
    } else {
      if (url.origin.startsWith(originURL)) {
        const pathname: string = url.href.replace(originURL, '');
        router.push(pathname);
        return;
      } else {
        processExternalURL(str);
      }
    }
  };

  const handleScan = (result: NimiqQrScanner.ScanResult) => {
    if (!result || !result.data) return;

    let dataScanned = result.data;
    const isURL: boolean = regexURL.test(dataScanned);

    if (isURL) {
      handleScanURL(dataScanned);
      return;
    } else {
      const isBitcoinSchema: boolean = dataScanned.startsWith('bitcoin:');

      if (isBitcoinSchema) {
        const lightningInvoice: string | undefined = dataScanned.match(/lightning=([^&]+)/)?.[1];
        if (lightningInvoice) dataScanned = lightningInvoice;
      }

      const cleanScan: string = removeLightningStandard(dataScanned);
      const scanType: TransferTypes = detectTransferType(cleanScan);
      if (scanType === TransferTypes.NONE) return;

      if (scanType === TransferTypes.INVOICE) {
        router.push(`/transfer/invoice/${cleanScan.toLowerCase()}`);
        return;
      }

      router.push(`/transfer/lnurl?data=${cleanScan.toLowerCase()}`);
    }
  };

  return (
    <>
      <Navbar showBackPage={true} title={t('SCAN_QR')} />

      <Flex justify="center" align="center" flex={1}>
        <QrScanner
          onDecode={handleScan}
          startOnLaunch={true}
          highlightScanRegion={true}
          highlightCodeOutline={true}
          constraints={{ facingMode: 'environment' }}
          preferredCamera={'environment'}
        />
      </Flex>

      <Modal title={t('URL_SCANNED_TITLE')} isOpen={Boolean(urlScanned.length)} onClose={() => null}>
        <Text>{t('URL_SCANNED_DESC', { url: urlScanned })}</Text>
        <Flex direction="column" gap={4}>
          <Flex>
            <Button onClick={handleOpenUrl}>{t('OPEN_URL')}</Button>
          </Flex>
          <Flex>
            <Button variant="borderless" onClick={() => setUrlScanned('')}>
              {t('CANCEL')}
            </Button>
          </Flex>
        </Flex>
      </Modal>
    </>
  );
}
