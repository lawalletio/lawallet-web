'use client';

import { Loader } from '@/components/Icons/Loader';
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
import { Button, Flex, Text, Feedback } from '@lawallet/ui';
import { NostrEvent } from '@nostr-dev-kit/ndk';
import { useTranslations } from 'next-intl';
import NimiqQrScanner from 'qr-scanner';
import { useEffect, useState } from 'react';

type ScannerInfo = {
  scanner: NimiqQrScanner | undefined;
  cameras: NimiqQrScanner.Camera[];
  hasPermissions: boolean;
  loaded: boolean;
};

export default function Page() {
  const [scannerInfo, setScannerInfo] = useState<ScannerInfo>({
    scanner: undefined,
    cameras: [],
    hasPermissions: false,
    loaded: false,
  });

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
    setUrlScanned('');
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

  const checkCamerasInfo = async () => {
    const checkCamera = await NimiqQrScanner.hasCamera();
    if (!checkCamera) {
      setScannerInfo((prev) => ({ ...prev, loaded: true }));
      return;
    }

    if (checkCamera) {
      const cameras = await NimiqQrScanner.listCameras(true);

      navigator.permissions.query({ name: 'camera' as PermissionName }).then((permissionStatus) => {
        const isAllowedCamera = (state: PermissionState) => state === 'granted';
        setScannerInfo((prev) => ({
          ...prev,
          cameras,
          hasPermissions: isAllowedCamera(permissionStatus.state),
          loaded: true,
        }));
      });
    }
  };

  useEffect(() => {
    checkCamerasInfo();
  }, []);

  return (
    <>
      <Navbar showBackPage={true} title={t('SCAN_QR')} backgroundColor="none" />

      <Flex justify="center" align="center">
        {!scannerInfo.loaded ? (
          <Loader />
        ) : scannerInfo.cameras.length && scannerInfo.hasPermissions ? (
          <QrScanner
            onDecode={handleScan}
            startOnLaunch={true}
            highlightScanRegion={true}
            highlightCodeOutline={true}
            constraints={{ facingMode: 'environment' }}
            preferredCamera={'environment'}
            onMount={(mountedScanner) => setScannerInfo((prev) => ({ ...prev, scanner: mountedScanner }))}
          />
        ) : (
          <Feedback show={true} status={'error'}>
            {!scannerInfo.cameras.length ? t('CAMERA_NOT_FOUND') : t('CAMERA_PERMISSIONS_NOT_FOUND')}
          </Feedback>
        )}
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
