/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import {
  formatToPreference,
  useActivity,
  useBalance,
  useConfig,
  useCurrencyConverter,
  useIdentity,
  useProfile,
  useSettings,
} from '@lawallet/react';
import {
  BannerAlert,
  BtnLoader,
  Container,
  Divider,
  Flex,
  Heading,
  HeroCard,
  Icon,
  ReceiveIcon,
  Text,
} from '@lawallet/ui';
import { GearIcon, HiddenIcon, SatoshiV2Icon, SendIcon, VisibleIcon } from '@bitcoin-design/bitcoin-icons-react/filled';

// Hooks and utils
import { Link, useRouter } from '@/navigation';
import { extractFirstTwoChars } from '@/utils';
import { copy } from '@/utils/share';

// Components
import Navbar from '@/components/Layout/Navbar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/UI/avatar';
import { TokenList } from '@/components/TokenList';
import TransactionItem from '@/components/TransactionItem';
import { Loader } from '@/components/Icons/Loader';
import Animations from '@/components/Animations';
import BitcoinTrade from '@/components/Animations/bitcoin-trade.json';
import Subnavbar from '@/components/Layout/Subnavbar';
import { Button } from '@/components/UI/button';

// Theme
import { appTheme } from '@/config/exports';

// Constans
import { CACHE_BACKUP_KEY, EMERGENCY_LOCK_DEPOSIT, EMERGENCY_LOCK_TRANSFER } from '@/utils/constants';

export default function Page() {
  const config = useConfig();
  const router = useRouter();
  const t = useTranslations();
  const lng = useLocale();
  const [showBanner, setShowBanner] = useState<'backup' | 'none'>('none');

  const identity = useIdentity();
  const { nip05Avatar, nip05 } = useProfile();
  const balance = useBalance();
  const activity = useActivity();

  const {
    loading,
    toggleHideBalance,
    props: { hideBalance, currency },
  } = useSettings();

  const { pricesData, convertCurrency } = useCurrencyConverter();

  const convertedBalance: string = useMemo(() => {
    const amount: number = convertCurrency(balance.amount, 'SAT', currency);
    return formatToPreference(currency, amount, lng);
  }, [balance, pricesData, currency]);

  const checkBackup = async () => {
    const userMadeBackup: boolean = Boolean(
      (await config.storage.getItem(`${CACHE_BACKUP_KEY}_${identity.pubkey}`)) || false,
    );

    setShowBanner(!userMadeBackup ? 'backup' : 'none');
  };

  useEffect(() => {
    checkBackup();
  }, []);

  return (
    <>
      <HeroCard>
        <Navbar>
          <div className="cursor-pointer">
            <Flex align="center" gap={8} onClick={() => router.push(`/profile`)} style={{ cursor: 'pointer' }}>
              <Avatar className="w-8 h-8">
                {nip05Avatar && <AvatarImage src={nip05Avatar} />}
                <AvatarFallback>{identity.username ? extractFirstTwoChars(identity.username) : 'AN'}</AvatarFallback>
              </Avatar>
              <Flex direction="column">
                <Text size="small" color={appTheme.colors.gray50}>
                  {t('HELLO')},
                </Text>
                <Flex
                  onClick={() => {
                    if (identity.lud16) copy(identity.lud16);
                  }}
                >
                  <p className="text-md whitespace-nowrap">
                    {loading
                      ? '--'
                      : nip05?.name || nip05?.displayName
                        ? nip05?.name || nip05?.displayName
                        : identity.lud16.length
                          ? identity.lud16
                          : t('ANONYMOUS')}
                  </p>
                </Flex>
              </Flex>
            </Flex>
          </div>
          <Flex gap={4} justify="end">
            <Button variant="secondary" size="icon" onClick={toggleHideBalance}>
              <Icon size="small">{hideBalance ? <HiddenIcon /> : <VisibleIcon />}</Icon>
            </Button>

            <Button variant="secondary" size="icon" onClick={() => router.push('/settings')}>
              <Icon size="small">
                <GearIcon />
              </Icon>
            </Button>
          </Flex>
        </Navbar>

        {/* <div className="bg-[#F9B550] text-black text-center py-2">
          <h1>{t('ERROR_MESSAGE')}</h1>
        </div> */}

        <Divider y={12} />

        <Flex direction="column" align="center" justify="center">
          <Text size="small" color={appTheme.colors.gray50}>
            {t('BALANCE')}
          </Text>
          <Divider y={8} />
          <Flex justify="center" align="center" gap={4}>
            <Flex justify="center" align="center" gap={4}>
              {!hideBalance ? (
                <>
                  {currency === 'SAT' ? (
                    <Icon size="small">
                      <SatoshiV2Icon />
                    </Icon>
                  ) : (
                    <Text>$</Text>
                  )}
                </>
              ) : null}

              <Heading>{loading || balance.loading ? <BtnLoader /> : hideBalance ? '*****' : convertedBalance}</Heading>
            </Flex>
          </Flex>
          <Divider y={8} />

          {!loading && <TokenList />}
        </Flex>

        <Divider y={12} />
      </HeroCard>

      <Container size="small">
        <Divider y={16} />
        <Flex gap={8}>
          <Button
            className="w-full"
            variant="secondary"
            onClick={() => router.push('/deposit')}
            disabled={EMERGENCY_LOCK_DEPOSIT}
          >
            <Icon>
              <ReceiveIcon />
            </Icon>
            {t('DEPOSIT')}
          </Button>
          <Button
            className="w-full"
            onClick={() => router.push('/transfer')}
            disabled={EMERGENCY_LOCK_TRANSFER || Number(balance.amount) === 0}
          >
            <Icon>
              <SendIcon />
            </Icon>
            {t('TRANSFER')}
          </Button>
        </Flex>
        <Divider y={16} />

        {showBanner === 'backup' ? (
          <>
            <Link href="/settings/recovery">
              <BannerAlert title={t('RECOMMEND_BACKUP')} description={t('RECOMMEND_BACKUP_REASON')} color="error" />
            </Link>
            <Divider y={16} />
          </>
        ) : null}

        {activity.loading ? (
          <Flex direction="column" justify="center" align="center" flex={1}>
            <Loader />
          </Flex>
        ) : activity.transactions.length === 0 ? (
          <Flex direction="column" justify="center" align="center" flex={1}>
            <Animations data={BitcoinTrade} />
            <Heading as="h4">{t('EMPTY_TRANSACTIONS_TITLE')}</Heading>
            <Divider y={4} />
            <Text size="small">{t('EMPTY_TRANSACTIONS_DESC')}</Text>
          </Flex>
        ) : (
          <>
            <Flex justify="space-between" align="center">
              <Text size="small" color={appTheme.colors.gray50}>
                {t('LAST_ACTIVITY').toUpperCase()}
              </Text>

              <Button size="sm" variant="link" onClick={() => router.push('/transactions')}>
                {t('SEE_ALL')}
              </Button>
            </Flex>

            <Flex direction="column" gap={4}>
              {activity.transactions.slice(0, 5).map((transaction) => (
                <TransactionItem key={transaction.id} transaction={transaction} />
              ))}
            </Flex>
          </>
        )}
        <Divider y={64} />
      </Container>

      <Subnavbar path="home" />
    </>
  );
}
