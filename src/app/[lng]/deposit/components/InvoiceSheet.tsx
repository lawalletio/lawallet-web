import { TokenList } from '@/components/TokenList';
import { Confetti, QRCode } from '@/components/UI';
import { appTheme } from '@/config/exports';
import { useActionOnKeypress } from '@/hooks/useActionOnKeypress';
import useErrors from '@/hooks/useErrors';
import { useRouter } from '@/navigation';
import { MAX_INVOICE_AMOUNT } from '@/utils/constants';
import { SatoshiV2Icon } from '@bitcoin-design/bitcoin-icons-react/filled';
import { useCurrencyConverter, useFormatter, useIdentity, useNumpad, useSettings, useZap } from '@lawallet/react';
import { AvailableLanguages } from '@lawallet/react/types';
import {
  BtnLoader,
  Button,
  CheckIcon,
  Container,
  Divider,
  Feedback,
  Flex,
  Heading,
  Icon,
  Keyboard,
  Sheet,
  Text,
} from '@lawallet/ui';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

type SheetTypes = 'amount' | 'qr' | 'finished';
type InvoiceSheetTypes = {
  isOpen: boolean;
  handleCopy: (text: string) => void;
  onClose: () => void;
};

const InvoiceSheet = ({ isOpen, handleCopy, onClose }: InvoiceSheetTypes) => {
  const errors = useErrors();
  const [sheetStep, setSheetStep] = useState<SheetTypes>('amount');

  const t = useTranslations();
  const lng = useLocale();
  const identity = useIdentity();

  const {
    props: { currency },
  } = useSettings();
  const { convertCurrency } = useCurrencyConverter();

  const { invoice, createZapInvoice, resetInvoice } = useZap({ receiverPubkey: identity.pubkey });

  const { formatAmount } = useFormatter({ currency, locale: lng as AvailableLanguages });

  const numpadData = useNumpad(currency);
  const router = useRouter();

  const handleClick = () => {
    if (invoice.loading) return;

    const amountSats: number = numpadData.intAmount['SAT'];
    if (amountSats < 1 || amountSats > MAX_INVOICE_AMOUNT) {
      const convertedMinAmount: number = convertCurrency(1, 'SAT', currency);
      const convertedMaxAmount: number = convertCurrency(MAX_INVOICE_AMOUNT, 'SAT', currency);

      errors.modifyError('ERROR_INVOICE_AMOUNT', {
        minAmount: convertedMinAmount.toString(),
        maxAmount: formatAmount(convertedMaxAmount),
        currency: currency,
      });
      return;
    }

    createZapInvoice(amountSats).then((bolt11: string | undefined) => {
      if (!bolt11) {
        errors.modifyError('ERROR_ON_CREATE_INVOICE');
        return;
      }

      setSheetStep('qr');
    });
  };

  const handleCloseSheet = () => {
    if (sheetStep === 'finished' || !identity.username.length) {
      router.push('/dashboard');
    } else {
      numpadData.resetAmount();
      setSheetStep('amount');
      resetInvoice();
      onClose();
    }
  };

  useEffect(() => {
    if (errors.errorInfo.visible) errors.resetError();
  }, [numpadData.intAmount]);

  useEffect(() => {
    if (invoice.payed) setSheetStep('finished');
  }, [invoice.payed]);

  useActionOnKeypress('Enter', handleClick, [numpadData.intAmount['SAT']]);

  return (
    <Sheet
      title={
        sheetStep === 'amount' ? t('DEFINE_AMOUNT') : sheetStep === 'qr' ? t('WAITING_PAYMENT') : t('PAYMENT_RECEIVED')
      }
      isOpen={isOpen || !identity.username.length}
      closeText={t('CLOSE')}
      onClose={handleCloseSheet}
    >
      {sheetStep === 'amount' && (
        <>
          <Container size="small">
            <Flex direction="column" gap={8} flex={1} justify="center" align="center">
              <Flex justify="center" align="center" gap={4}>
                {currency === 'SAT' ? (
                  <Icon size="small">
                    <SatoshiV2Icon />
                  </Icon>
                ) : (
                  <Text>$</Text>
                )}
                <Heading>{formatAmount(numpadData.intAmount[numpadData.usedCurrency])}</Heading>
              </Flex>

              <TokenList />

              <Feedback show={errors.errorInfo.visible} status={'error'}>
                {errors.errorInfo.text}
              </Feedback>
            </Flex>
            <Divider y={24} />
            <Flex gap={8}>
              <Button
                variant="filled"
                onClick={handleClick}
                disabled={invoice.loading || numpadData.intAmount['SAT'] === 0}
                loading={invoice.loading}
              >
                {t('GENERATE')}
              </Button>
            </Flex>
            <Divider y={24} />
            <Keyboard numpadData={numpadData} />
          </Container>
        </>
      )}

      {sheetStep === 'qr' && (
        <>
          <Flex flex={1} justify="center" align="center">
            <QRCode size={300} value={`${invoice.bolt11.toUpperCase()}`} />
          </Flex>
          <Divider y={24} />
          <Container size="small">
            <Flex direction="column" justify="center" align="center" flex={1} gap={8}>
              <BtnLoader />
              <Text size="small" color={appTheme.colors.gray50}>
                {t('WAITING_PAYMENT_OF')}
              </Text>
              <Flex justify="center" align="center" gap={4}>
                {currency === 'SAT' ? (
                  <Icon size="small">
                    <SatoshiV2Icon />
                  </Icon>
                ) : (
                  <Text>$</Text>
                )}
                <Heading>{formatAmount(numpadData.intAmount[numpadData.usedCurrency])} </Heading>

                <Text>{currency}</Text>
              </Flex>
            </Flex>
            <Divider y={24} />
            <Flex gap={8}>
              <Button variant="bezeledGray" onClick={handleCloseSheet}>
                {t('CANCEL')}
              </Button>
              <Button variant="bezeled" onClick={() => handleCopy(invoice.bolt11)}>
                {t('COPY')}
              </Button>
            </Flex>
          </Container>
        </>
      )}

      {sheetStep === 'finished' && (
        <>
          <Confetti />
          <Container size="small">
            <Flex direction="column" justify="center" flex={1} align="center" gap={8}>
              <Icon color={appTheme.colors.primary}>
                <CheckIcon />
              </Icon>
              <Text size="small" color={appTheme.colors.gray50}>
                {t('PAYMENT_RECEIVED')}
              </Text>
              <Flex justify="center" align="center" gap={4}>
                {currency === 'SAT' ? (
                  <Icon size="small">
                    <SatoshiV2Icon />
                  </Icon>
                ) : (
                  <Text>$</Text>
                )}
                <Heading>{formatAmount(numpadData.intAmount[numpadData.usedCurrency])}</Heading>
              </Flex>
            </Flex>
            <Flex gap={8}>
              <Button variant="bezeledGray" onClick={handleCloseSheet}>
                {t('CLOSE')}
              </Button>
            </Flex>
          </Container>
        </>
      )}
    </Sheet>
  );
};

export default InvoiceSheet;
