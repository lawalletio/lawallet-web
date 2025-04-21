'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useBalance, useCurrencyConverter, useFormatter, useSettings } from '@lawallet/react';
import { AvailableLanguages, TransferTypes } from '@lawallet/react/types';
import { Container, Divider, Feedback, Flex, Heading, Icon, Text } from '@lawallet/ui';
import { SatoshiV2Icon } from '@bitcoin-design/bitcoin-icons-react/filled';

import { TokenList } from '@/components/TokenList';
import CardWithData from './CardWithData';
import { Button } from '@/components/UI/button';
import { LoaderCircle } from 'lucide-react';
import { Link } from '@/navigation';

type SummaryProps = {
  isLoading: boolean;
  isSuccess: boolean;
  isPending: boolean;
  data: string;
  type: TransferTypes;
  amount: number;
  expired?: boolean;
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
};

export const Summary = ({
  isLoading,
  isSuccess,
  isPending,
  data,
  type,
  amount,
  expired = false,
  onClick,
}: SummaryProps) => {
  const lng = useLocale();
  const t = useTranslations();

  const [insufficientBalance, setInsufficientBalance] = useState<boolean>(false);

  const {
    props: { currency },
  } = useSettings();

  const { pricesData, convertCurrency } = useCurrencyConverter();

  const balance = useBalance();
  const { formatAmount } = useFormatter({ currency, locale: lng as AvailableLanguages });

  const convertedAmount: string = useMemo(() => {
    const convertedInt: number = convertCurrency(amount, 'SAT', currency);

    return formatAmount(convertedInt);
  }, [amount, pricesData, currency]);

  const detectInsufficientBalance = useCallback(() => {
    setInsufficientBalance(!isLoading && !isSuccess && !isPending && balance.amount < amount);
  }, [balance.amount, amount, isLoading, isSuccess]);

  useEffect(() => {
    detectInsufficientBalance();
  }, [balance.amount, amount]);

  return (
    <>
      <Container size="small">
        <CardWithData type={type} data={data} />
        <Divider y={16} />
        <Flex direction="column" flex={1} justify="center" align="center" gap={8}>
          <Heading as="h6">Total</Heading>

          {Number(convertedAmount) !== 0 ? (
            <Flex align="center" justify="center" gap={4}>
              {currency === 'SAT' ? (
                <Icon size="small">
                  <SatoshiV2Icon />
                </Icon>
              ) : (
                <Text>$</Text>
              )}
              <Heading>{convertedAmount}</Heading>
              <Text>{currency}</Text>
            </Flex>
          ) : (
            <Flex align="center" justify="center" gap={4}>
              <Icon size="small">
                <SatoshiV2Icon />
              </Icon>
              <Heading>{amount}</Heading>
              <Text>SAT</Text>
            </Flex>
          )}
          <Divider y={8} />
          <TokenList />
        </Flex>
        <Divider y={16} />
      </Container>

      {expired || (type !== TransferTypes.LNURLW && !balance.loading && insufficientBalance) ? (
        <Flex flex={1} align="center" justify="center">
          <Feedback show={true} status={'error'}>
            {expired ? t('INVOICE_EXPIRED') : t('INSUFFICIENT_BALANCE')}
          </Feedback>
        </Flex>
      ) : null}

      <Flex>
        <Container size="small">
          <Divider y={16} />
          <Flex gap={8}>
            <Button className="w-full" variant="secondary">
              <Link href="/dashboard">{t('CANCEL')}</Link>
            </Button>
            <Button
              className="w-full"
              onClick={onClick}
              disabled={
                !type || isLoading || isPending || expired || (type !== TransferTypes.LNURLW && insufficientBalance)
              }
            >
              {isLoading || isPending ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : type === TransferTypes.LNURLW ? (
                t('CLAIM')
              ) : (
                t('TRANSFER')
              )}
            </Button>
          </Flex>
          <Divider y={32} />
        </Container>
      </Flex>
    </>
  );
};
