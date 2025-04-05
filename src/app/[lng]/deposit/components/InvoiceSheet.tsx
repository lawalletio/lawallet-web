import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useCurrencyConverter, useFormatter, useIdentity, useNumpad, useSettings, useZap } from '@lawallet/react';
import { AvailableLanguages } from '@lawallet/react/types';
import { BtnLoader, CheckIcon, Container, Divider, Feedback, Flex, Heading, Icon, Text } from '@lawallet/ui';
import { SatoshiV2Icon } from '@bitcoin-design/bitcoin-icons-react/filled';
import { LoaderCircle } from 'lucide-react';

import { useRouter } from '@/navigation';
import useErrors from '@/hooks/useErrors';
import { useActionOnKeypress } from '@/hooks/useActionOnKeypress';
import { MAX_INVOICE_AMOUNT } from '@/utils/constants';

import { TokenList } from '@/components/TokenList';
import { Confetti, QRCode } from '@/components/UI';
import { Button } from '@/components/UI/button';
import { Keyboard } from '@/components/keyboard';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/UI/sheet';

import { appTheme } from '@/config/exports';

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
      // title=
      open={isOpen || !identity.username.length}
      // closeText={t('CLOSE')}
      onOpenChange={handleCloseSheet}
    >
      <SheetContent className="max-h-screen h-full" side="bottom">
        <SheetHeader>
          <SheetTitle>
            {sheetStep === 'amount'
              ? t('DEFINE_AMOUNT')
              : sheetStep === 'qr'
                ? t('WAITING_PAYMENT')
                : t('PAYMENT_RECEIVED')}
          </SheetTitle>
        </SheetHeader>
        {sheetStep === 'amount' && (
          <>
            <div className="relative container flex-1 flex flex-col">
              <div className="flex-1 flex flex-col gap-4 justify-center items-center">
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
              </div>
              <Divider y={24} />
              <Flex gap={8}>
                <Button
                  className="w-full"
                  onClick={handleClick}
                  disabled={invoice.loading || numpadData.intAmount['SAT'] === 0}
                >
                  {invoice.loading ? <LoaderCircle className="size-6 animate-spin" /> : t('GENERATE')}
                </Button>
              </Flex>
              <Divider y={24} />
              <Keyboard numpadData={numpadData} />
            </div>
          </>
        )}

        {sheetStep === 'qr' && (
          <div className="flex flex-col justify-end h-full px-4">
            <div className="flex justify-center">
              <QRCode size={300} value={`${invoice.bolt11}`} />
            </div>
            <Divider y={24} />
            <div className="flex flex-col justify-center items-center gap-2 w-full">
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
            </div>
            <Divider y={24} />
            <Flex gap={8}>
              <Button className="w-full" variant="ghost" onClick={handleCloseSheet}>
                {t('CANCEL')}
              </Button>
              <Button className="w-full" variant="secondary" onClick={() => handleCopy(invoice.bolt11)}>
                {t('COPY')}
              </Button>
            </Flex>
          </div>
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
                <Button variant="secondary" onClick={handleCloseSheet}>
                  {t('CLOSE')}
                </Button>
              </Flex>
            </Container>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default InvoiceSheet;
