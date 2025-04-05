'use client';

// Libraries
import React, { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  detectTransferType,
  formatLNURLData,
  normalizeLNDomain,
  removeDuplicateArray,
  useConfig,
  useActivity,
  useNostr,
} from '@lawallet/react';
import { Transaction, TransactionDirection, TransferTypes } from '@lawallet/react/types';
import {
  Autocomplete,
  Container,
  Divider,
  Feedback,
  Flex,
  Icon,
  InputGroup,
  InputGroupRight,
  LinkButton,
  Text,
} from '@lawallet/ui';
import { useTranslations } from 'next-intl';
import { NostrEvent } from 'nostr-tools';
import { CaretRightIcon } from '@bitcoin-design/bitcoin-icons-react/filled';

// Hooks and utils
import { useActionOnKeypress } from '@/hooks/useActionOnKeypress';
import useErrors from '@/hooks/useErrors';
import { lightningAddresses } from '@/utils/constants';

// Constans
import { EMERGENCY_LOCK_TRANSFER } from '@/utils/constants';
import { extractMetadata } from '@/utils';

// Components
import Navbar from '@/components/Layout/Navbar';
import RecipientElement from './components/RecipientElement';
import { Button } from '@/components/UI/button';

// Theme
import { appTheme } from '@/config/exports';
import { LoaderCircle } from 'lucide-react';
import Link from 'next/link';

export default function Page() {
  const router = useRouter();

  if (EMERGENCY_LOCK_TRANSFER) {
    router.push('/dashboard');
    return null;
  }

  const t = useTranslations();
  const params = useSearchParams();
  const errors = useErrors();
  const config = useConfig();

  const [lastDestinations, setLastDestinations] = useState<string[]>([]);

  const { transactions } = useActivity();
  const { decrypt } = useNostr();

  const [inputText, setInputText] = useState<string>(params.get('data') ?? '');
  const [loading, setLoading] = useState<boolean>(false);

  const initializeTransfer = async (data: string) => {
    if (loading) return;
    setLoading(true);

    const cleanData: string = data.trim();
    const type: TransferTypes = detectTransferType(cleanData);

    switch (type) {
      case TransferTypes.NONE:
        errors.modifyError('INVALID_RECIPIENT');
        setLoading(false);
        return;

      case TransferTypes.INVOICE:
        router.push(`/transfer/invoice/${cleanData}`);
        return;
    }

    const formattedLNURLData = await formatLNURLData(cleanData);
    if (formattedLNURLData.type === TransferTypes.NONE || formattedLNURLData.type === TransferTypes.INVOICE) {
      errors.modifyError('INVALID_RECIPIENT');
      setLoading(false);
      return;
    }

    router.push(`/transfer/lnurl?data=${cleanData}`);
    return;
  };

  const handleContinue = async () => {
    if (!inputText.length) return errors.modifyError('EMPTY_RECIPIENT');
    initializeTransfer(inputText);
  };

  useActionOnKeypress('Enter', handleContinue, [inputText]);

  const handlePasteInput = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputText(text);
    } catch (error) {
      console.log('error', error);
    }
  };

  const getLastDestinations = React.useCallback(() => {
    const receiversList: string[] = [];
    transactions.forEach(async (tx: Transaction) => {
      if (tx.direction === TransactionDirection.OUTGOING && tx.metadata) {
        const metadata = await extractMetadata(tx.events[0] as NostrEvent, tx.direction, decrypt, config);
        if (
          metadata &&
          metadata.receiver &&
          metadata.receiver.includes('@') &&
          !receiversList.includes(metadata.receiver)
        )
          receiversList.push(metadata.receiver);
      }
    });

    setLastDestinations(receiversList);
  }, [transactions]);

  useEffect(() => {
    getLastDestinations();
  }, [transactions]);

  const autoCompleteData: string[] = useMemo(() => {
    if (!inputText.length || inputText.length > 15) return [];

    const data: string[] = lastDestinations.filter((dest) => dest.startsWith(inputText));
    if (data.length >= 3) return data;

    if (!inputText.includes('@'))
      return removeDuplicateArray([`${inputText}@${normalizeLNDomain(config.endpoints.lightningDomain)}`, ...data]);

    const [username, domain] = inputText.split('@');
    if (!domain) data.push(`${username}@${normalizeLNDomain(config.endpoints.lightningDomain)}`);

    const recommendations: string[] = [];
    lightningAddresses.forEach((address) => {
      if (address.startsWith(domain)) recommendations.push(`${username}@${address}`);
    });

    return removeDuplicateArray([...data, ...recommendations]);
  }, [lastDestinations, inputText]);

  return (
    <>
      <Navbar showBackPage={true} title={t('TRANSFER_MONEY')} overrideBack="/dashboard" />

      <Container size="small">
        <Divider y={16} />
        <Flex flex={1} direction="column">
          <InputGroup>
            <Autocomplete
              data={autoCompleteData}
              onSelect={setInputText}
              onChange={(e) => {
                errors.resetError();
                setInputText(e.target.value);
              }}
              placeholder={t('TRANSFER_DATA_PLACEHOLDER')}
              type="text"
              value={inputText}
              status={errors.errorInfo.visible ? 'error' : undefined}
              disabled={loading}
              visible={Boolean(autoCompleteData.length) && !loading}
            />
            <InputGroupRight>
              <Button size="sm" variant="ghost" onClick={handlePasteInput} disabled={!!inputText}>
                {t('PASTE')}
              </Button>
            </InputGroupRight>
          </InputGroup>

          <Feedback show={errors.errorInfo.visible} status={'error'}>
            {errors.errorInfo.text}
          </Feedback>

          <Divider y={16} />
          <Flex>
            <Button className="w-full" color="secondary" variant="secondary" asChild>
              <Link href="/scan">{t('SCAN_QR_CODE')}</Link>
            </Button>
          </Flex>
          <Divider y={16} />
          {/* Ultimos 3 destinos */}
          {Boolean(lastDestinations.length) && (
            <>
              <Text size="small" color={appTheme.colors.gray50}>
                {t('LAST_RECIPIENTS')}
              </Text>

              <Divider y={12} />

              {lastDestinations.slice(0, 5).map((lud16) => {
                return (
                  <Flex key={lud16} onClick={() => initializeTransfer(lud16)} direction="column">
                    <Divider y={8} />
                    <Flex align="center">
                      <RecipientElement lud16={lud16} />
                      <Icon>
                        <CaretRightIcon />
                      </Icon>
                    </Flex>
                    <Divider y={8} />
                  </Flex>
                );
              })}
            </>
          )}
        </Flex>
      </Container>

      <Flex>
        <Container size="small">
          <Divider y={16} />
          <Flex gap={8}>
            <Button className="w-full" variant="secondary" onClick={() => router.push('/dashboard')}>
              {t('CANCEL')}
            </Button>

            <Button className="w-full" onClick={handleContinue} disabled={loading || inputText.length === 0}>
              {loading ? <LoaderCircle className="size-4 animate-spin" /> : t('CONTINUE')}
            </Button>
          </Flex>
          <Divider y={32} />
        </Container>
      </Flex>
    </>
  );
}
