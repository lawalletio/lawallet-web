'use client';

import { useMemo } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { formatAddress, splitHandle, useCurrencyConverter, useFormatter, useSettings } from '@lawallet/react';
import { AvailableLanguages, TransferInformation, TransferTypes } from '@lawallet/react/types';
import { Avatar, Container, Divider, Flex, Heading, Icon, Text } from '@lawallet/ui';
import { SatoshiV2Icon } from '@bitcoin-design/bitcoin-icons-react/filled';

import { useRouter } from '@/navigation';
import { extractFirstTwoChars } from '@/utils';

import Navbar from '@/components/Layout/Navbar';
import { Confetti } from '@/components/UI';
import { Button } from '@/components/UI/button';
import Link from 'next/link';

export const FinishTransfer = ({ transferInfo }: { transferInfo: TransferInformation }) => {
  const lng = useLocale();
  const t = useTranslations();

  const {
    props: { currency },
  } = useSettings();

  const { pricesData, convertCurrency } = useCurrencyConverter();
  const { formatAmount } = useFormatter({ currency, locale: lng as AvailableLanguages });

  const convertedAmount: string = useMemo(() => {
    const convertion: number = convertCurrency(transferInfo.amount, 'SAT', currency);

    return formatAmount(convertion);
  }, [pricesData]);

  const router = useRouter();
  const [transferUsername, transferDomain] = splitHandle(transferInfo.data);
  if (!transferInfo.data) router.push('/dashboard');

  return (
    <>
      <Navbar />

      <Container size="small">
        <Confetti />
        <Divider y={16} />
        <Heading>{t('FINISH_TRANSFER_TITLE')}</Heading>
        <Divider y={4} />
        <Text size="small">{transferInfo.type === TransferTypes.LNURLW ? t('SUCCESS_CLAIM') : t('TRANSFER_TO')}</Text>
        <Divider y={24} />
        <Flex align="center" gap={8}>
          <Avatar size="large">
            <Text size="small">{extractFirstTwoChars(transferUsername)}</Text>
          </Avatar>
          {transferInfo.type === TransferTypes.LNURLW || transferInfo.type === TransferTypes.INVOICE ? (
            <Text>{formatAddress(transferInfo.data, 25)}</Text>
          ) : (
            <Text>
              {transferUsername}@{transferDomain}
            </Text>
          )}
        </Flex>
        <Divider y={24} />
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
            <Heading>{transferInfo.amount}</Heading>
            <Text>SAT</Text>
          </Flex>
        )}
        <Divider y={24} />
      </Container>

      <Flex>
        <Container size="small">
          <Divider y={16} />
          <Flex gap={8}>
            <Button className="w-full" variant="ghost" asChild>
              <Link href="/dashboard">{t('GO_HOME')}</Link>
            </Button>
          </Flex>
          <Divider y={32} />
        </Container>
      </Flex>
    </>
  );
};
