'use client';

import { SatoshiV2Icon } from '@bitcoin-design/bitcoin-icons-react/filled';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { TokenList } from '@/components/TokenList';
import { appTheme } from '@/config/exports';
import { useActionOnKeypress } from '@/hooks/useActionOnKeypress';
import useErrors from '@/hooks/useErrors';
import { decimalsToUse, useBalance, useCurrencyConverter, useFormatter, useNumpad, useSettings } from '@lawallet/react';
import { AvailableLanguages, LNURLTransferType, TransferTypes } from '@lawallet/react/types';
import {
  Button,
  Container,
  Divider,
  Feedback,
  Flex,
  Heading,
  Icon,
  InputWithLabel,
  Keyboard,
  Text,
} from '@lawallet/ui';
import { useLocale, useTranslations } from 'next-intl';
import CardWithData from './CardWithData';

type SelectTransferAmountType = {
  transferInfo: LNURLTransferType;
  setAmountToPay: (amount: number) => void;
  setComment: (comment: string) => void;
};

export const SelectTransferAmount = ({ transferInfo, setAmountToPay, setComment }: SelectTransferAmountType) => {
  const lng = useLocale();
  const t = useTranslations();

  const [commentFocus, setCommentFocus] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const balance = useBalance();

  const {
    props: { currency: userCurrency, hideBalance },
  } = useSettings();
  const { pricesData, convertCurrency } = useCurrencyConverter();

  const maxAvailableAmount: number = useMemo(() => {
    const convertedAmount: number = convertCurrency(balance.amount, 'SAT', userCurrency);

    return convertedAmount;
  }, [pricesData, balance.amount, userCurrency]);

  const numpadData = useNumpad(userCurrency, maxAvailableAmount);
  const params = useSearchParams();
  const errors = useErrors();
  const router = useRouter();

  const handleClick = () => {
    if (loading) return;
    if (!transferInfo.data) router.push('/transfer');

    setLoading(true);

    const satsAmount: number =
      numpadData.intAmount['SAT'] > balance.amount ? balance.amount : numpadData.intAmount['SAT'];

    if (transferInfo.type === TransferTypes.LUD16 && transferInfo.request) {
      const mSats = satsAmount * 1000;
      const { minSendable, maxSendable } = transferInfo.request;

      if (mSats < minSendable! || mSats > maxSendable!) {
        errors.modifyError('INVALID_SENDABLE_AMOUNT', {
          minSendable: (minSendable! / 1000).toString(),
          maxSendable: (maxSendable! / 1000).toString(),
          currency: 'SAT',
        });

        setLoading(false);
        return;
      }
    }

    setAmountToPay(satsAmount);
    router.push(
      `/transfer/lnurl/summary?data=${transferInfo.data}&amount=${satsAmount}${transferInfo.comment ? `&comment=${transferInfo.comment}` : ''}`,
    );
  };

  const handleChangeComment = (text: string) => {
    if (!text.length) {
      setComment('');
      return;
    }

    if (text.length > 255 || (transferInfo.request && text.length > transferInfo.request.commentAllowed)) {
      errors.modifyError('COMMENT_MAX_LENGTH', {
        chars: (transferInfo.request?.commentAllowed ?? 255).toString(),
      });
      return;
    }

    // const isValidComment = regexComment.test(text);
    // if (!isValidComment) {
    //   errors.modifyError('ERROR_ON_COMMENT');
    //   return;
    // }

    setComment(text);
  };

  useEffect(() => {
    const amountParam: number = Number(params.get('amount')) ?? transferInfo.amount;
    if (amountParam && amountParam !== numpadData.intAmount['SAT']) {
      const convertedAmount: number =
        convertCurrency(amountParam, 'SAT', userCurrency) * 10 ** decimalsToUse(userCurrency);

      numpadData.updateNumpadAmount(convertedAmount.toString());
    }
  }, [pricesData]);

  useActionOnKeypress('Enter', handleClick, [numpadData, transferInfo]);

  const { formatAmount, customFormat } = useFormatter({ currency: userCurrency, locale: lng as AvailableLanguages });

  return (
    <>
      <Container size="small">
        <CardWithData type={transferInfo.type} data={transferInfo.data} />
        <Divider y={16} />
        <Flex direction="column" gap={8} flex={1} justify="center">
          <Flex justify="center" align="center" gap={4}>
            {userCurrency === 'SAT' ? (
              <Icon size="small">
                <SatoshiV2Icon />
              </Icon>
            ) : (
              <Text>$</Text>
            )}
            <Heading>{formatAmount(numpadData.intAmount[numpadData.usedCurrency])}</Heading>
          </Flex>

          {!hideBalance && (
            <Flex justify="center" align="center" gap={4}>
              <Heading as="h6" color={appTheme.colors.gray50}>
                {userCurrency !== 'SAT' && '$'}
                {formatAmount(maxAvailableAmount)} {t('AVAILABLE')}.
              </Heading>
            </Flex>
          )}

          <TokenList />

          {transferInfo.request && (
            <Flex justify="center">
              <Feedback show={true} status={'success'}>
                {t('SENDABLE_AMOUNT', {
                  minSendable: customFormat({ amount: transferInfo.request.minSendable! / 1000, currency: 'SAT' }),
                  maxSendable: customFormat({ amount: transferInfo.request.maxSendable! / 1000, currency: 'SAT' }),
                })}
              </Feedback>
            </Flex>
          )}
        </Flex>

        <Feedback show={errors.errorInfo.visible} status={'error'}>
          {errors.errorInfo.text}
        </Feedback>

        <Divider y={24} />
        <Flex gap={16} align="end">
          <Flex direction="column" align="end">
            {/* POC: integrate message */}
            <InputWithLabel
              label={t('MESSAGE')}
              name="message"
              placeholder={t('OPTIONAL')}
              onChange={(e) => handleChangeComment(e.target.value)}
              value={transferInfo.comment}
              onFocus={() => setCommentFocus(true)}
              onBlur={() => setCommentFocus(false)}
            />
          </Flex>
          <Flex>
            <Button
              onClick={handleClick}
              disabled={loading || balance.amount === 0 || numpadData.intAmount['SAT'] === 0}
              loading={loading}
            >
              {t('CONTINUE')}
            </Button>
          </Flex>
        </Flex>
        <Divider y={24} />

        <Keyboard numpadData={numpadData} disableKeydown={commentFocus} />

        <Divider y={32} />
      </Container>
    </>
  );
};
