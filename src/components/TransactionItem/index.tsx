'use client';

import { CreditCardIcon, LightningIcon, TransferIcon } from '@bitcoin-design/bitcoin-icons-react/filled';

import { Accordion, AccordionBody, Flex, Text } from '@lawallet/ui';

import { appTheme } from '@/config/exports';
import {
  dateFormatter,
  defaultCurrency,
  unescapingText,
  useCurrencyConverter,
  useFormatter,
  useSettings,
} from '@lawallet/react';
import { AvailableLanguages, Transaction, TransactionDirection, TransactionStatus } from '@lawallet/react/types';
import { BtnLoader } from '@lawallet/ui';
import { useLocale, useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

interface ComponentProps {
  transaction: Transaction;
}

type LudInfoProps = {
  loading: boolean;
  data: string;
};

const defaultTransferText: string = 'Lightning';

export default function Component({ transaction }: ComponentProps) {
  if (!transaction) return null;
  const lng = useLocale();
  const t = useTranslations();

  const { status, type } = transaction;

  const {
    props: { hideBalance, currency },
  } = useSettings();

  const { pricesData, convertCurrency } = useCurrencyConverter();

  const isFromMe = transaction?.direction === 'OUTGOING';
  const satsAmount = transaction.tokens?.BTC / 1000 || 0;

  const [ludInfo, setLudInfo] = useState<LudInfoProps>({
    loading: false,
    data: defaultTransferText,
  });

  const listTypes = {
    CARD: { icon: <CreditCardIcon />, label: t('YOU_PAID') },
    INTERNAL: { icon: <TransferIcon />, label: t('YOU_TRANSFER') },
    LN: { icon: <LightningIcon />, label: t('YOU_SEND') },
  };

  const convertedFiatAmount = useMemo(
    () => convertCurrency(satsAmount, 'SAT', currency === 'SAT' ? defaultCurrency : currency),
    [pricesData, currency],
  );

  const { customFormat } = useFormatter({ locale: lng as AvailableLanguages });

  const handleOpenAccordion = async () => {
    setLudInfo({ ...ludInfo, loading: true });

    if (transaction.metadata) {
      const username: string =
        transaction.direction === TransactionDirection.INCOMING
          ? transaction.metadata.sender ?? defaultTransferText
          : transaction.metadata.receiver ?? defaultTransferText;

      setLudInfo({
        loading: false,
        data: username,
      });
    } else {
      setLudInfo({ ...ludInfo, loading: false });
    }
  };

  if (!satsAmount) return null;

  return (
    <>
      <Accordion
        variant="borderless"
        onOpen={handleOpenAccordion}
        trigger={
          <Flex align="center" gap={8}>
            <Flex align="center" gap={8}>
              {/* <Icon>{listTypes[type].icon}</Icon> */}
              <Text>
                {transaction.status === TransactionStatus.REVERTED
                  ? t('TX_REVERTED')
                  : transaction.status === TransactionStatus.ERROR
                    ? t('FAILED_TRANSACTION')
                    : transaction.status === TransactionStatus.PENDING
                      ? t(`PENDING_${!isFromMe ? 'INBOUND' : 'OUTBOUND'}_TRANSACTION`)
                      : isFromMe
                        ? listTypes[type].label
                        : t('YOU_RECEIVE')}
              </Text>
            </Flex>
            <Flex direction="column" align="end">
              <Text
                color={
                  hideBalance
                    ? appTheme.colors.text
                    : transaction.status === TransactionStatus.ERROR ||
                        transaction.status === TransactionStatus.REVERTED
                      ? appTheme.colors.error
                      : transaction.status === TransactionStatus.PENDING
                        ? appTheme.colors.warning
                        : isFromMe
                          ? appTheme.colors.text
                          : appTheme.colors.success
                }
              >
                {hideBalance ? (
                  '*****'
                ) : (
                  <>
                    {!(
                      transaction.status === TransactionStatus.ERROR ||
                      transaction.status === TransactionStatus.REVERTED
                    ) && <>{!isFromMe ? '+ ' : '- '}</>}
                    {customFormat({ amount: satsAmount, currency: 'SAT' })} SAT
                  </>
                )}
              </Text>
              <Text size="small" color={appTheme.colors.gray50}>
                {hideBalance
                  ? '*****'
                  : `$${customFormat({ amount: convertedFiatAmount, currency: currency === 'SAT' ? defaultCurrency : currency, minDecimals: 2 })} ${currency === 'SAT' ? defaultCurrency : currency}`}
              </Text>
            </Flex>
          </Flex>
        }
      >
        <AccordionBody>
          <ul>
            <li>
              <Flex align="center" justify="space-between">
                <Text size="small" color={appTheme.colors.gray50}>
                  {isFromMe ? t('TO') : t('FROM')}
                </Text>
                <Text>{ludInfo.loading ? <BtnLoader /> : ludInfo.data}</Text>
              </Flex>
            </li>
            <li>
              <Flex align="center" justify="space-between">
                <Text size="small" color={appTheme.colors.gray50}>
                  {t('DATE')}
                </Text>
                <Flex direction="column" align="end">
                  <Text>{dateFormatter(lng, new Date(Number(transaction.createdAt)), 'HH:mm')}</Text>
                  <Text size="small" color={appTheme.colors.gray50}>
                    {dateFormatter(lng, new Date(Number(transaction.createdAt)), 'MMMM d, yyyy')}
                  </Text>
                </Flex>
              </Flex>
            </li>

            {transaction.memo ? (
              <li>
                <Flex align="center" justify="space-between">
                  <Text size="small" color={appTheme.colors.gray50}>
                    {t('MESSAGE')}
                  </Text>
                  <Text>{unescapingText(transaction.memo)}</Text>
                </Flex>
              </li>
            ) : null}

            <li>
              <Flex align="center" justify="space-between">
                <Text size="small" color={appTheme.colors.gray50}>
                  {t('STATUS')}
                </Text>
                <Text>{t(status)}</Text>
              </Flex>
            </li>
          </ul>
          {/* <Flex>
            <Button variant="bezeled" onClick={() => null}>
              {t('SHARE')}
            </Button>
          </Flex> */}
        </AccordionBody>
      </Accordion>
    </>
  );
}
