'use client';
import Navbar from '@/components/Layout/Navbar';
import { appTheme } from '@/config/exports';
import { regexComment } from '@/utils/constants';
import { useCardsContext } from '@/context/CardsContext';
import { useActionOnKeypress } from '@/hooks/useActionOnKeypress';
import useErrors from '@/hooks/useErrors';
import { roundToDown, useFormatter } from '@lawallet/react';
import { AvailableLanguages, CardPayload, CardStatus, Limit } from '@lawallet/react/types';
import {
  Button,
  Container,
  Divider,
  Feedback,
  Flex,
  Heading,
  InputWithLabel,
  Label,
  Loader,
  Text,
  ToggleSwitch,
} from '@lawallet/ui';
import { useLocale, useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import LimitInput from '../components/LimitInput/LimitInput';

const regexNumbers: RegExp = /^[0123456789]+$/;

const defaultTXLimit: Limit = {
  name: 'Transactional limit',
  description: 'Spending limit per transaction',
  token: 'BTC',
  amount: BigInt(100000000000).toString(),
  delta: 0,
};

const defaultDailyLimit: Limit = {
  name: 'Daily limit',
  description: 'Spending limit per day',
  token: 'BTC',
  amount: BigInt(1000000000).toString(),
  delta: 86400,
};

type LimitsConfigOptions = 'tx' | 'daily';

const NAME_MAX_LENGTH = 32;
const DESC_MAX_LENGTH = 64;

const page = () => {
  const lng = useLocale() as AvailableLanguages;
  const t = useTranslations();

  const errors = useErrors();
  const router = useRouter();
  const params = useParams();

  const uuid: string = useMemo(() => params.uuid as string, []);

  const { cardsData, cardsConfig, loadInfo, updateCardConfig } = useCardsContext();

  const [newConfig, setNewConfig] = useState<CardPayload>({
    name: '',
    description: '',
    status: CardStatus.ENABLED,
    limits: [],
  });

  const selectedLimit: LimitsConfigOptions = useMemo(() => {
    if (!newConfig.limits.length) return 'tx';

    const limitDelta: number = newConfig.limits[0].delta;
    return limitDelta === defaultTXLimit.delta ? 'tx' : 'daily';
  }, [newConfig.limits]);

  const handleChangeLimit = (e: ChangeEvent<HTMLInputElement>) => {
    errors.resetError();
    const targetValue = e.target.value ?? 0;
    if (targetValue.length && !regexNumbers.test(targetValue)) {
      errors.modifyError('ONLY_NUMBERS_ALLOWED');
      return;
    }

    const inputAmount: number = !e.target.value ? 0 : parseFloat(e.target.value);
    const mSats: number = inputAmount * 1000;

    setNewConfig({
      ...newConfig,
      limits: [
        selectedLimit === 'tx'
          ? { ...defaultTXLimit, amount: BigInt(mSats).toString() }
          : { ...defaultDailyLimit, amount: BigInt(mSats).toString() },
      ],
    });
  };

  const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    errors.resetError();
    const name: string = e.target.value;

    setNewConfig({
      ...newConfig,
      name,
    });
  };

  const handleChangeDesc = (e: ChangeEvent<HTMLInputElement>) => {
    errors.resetError();
    const description: string = e.target.value;

    setNewConfig({
      ...newConfig,
      description,
    });
  };

  const handleSaveConfig = async () => {
    if (!newConfig.name.length) return errors.modifyError('EMPTY_NAME');
    if (newConfig.name.length > NAME_MAX_LENGTH)
      return errors.modifyError('MAX_LENGTH_NAME', { length: `${NAME_MAX_LENGTH}` });
    if (!regexComment.test(newConfig.name)) return errors.modifyError('INVALID_USERNAME');

    if (newConfig.description.length > DESC_MAX_LENGTH)
      return errors.modifyError('MAX_LENGTH_DESC', { length: `${DESC_MAX_LENGTH}` });
    if (!regexComment.test(newConfig.description)) return errors.modifyError('INVALID_USERNAME');

    const updated: boolean = await updateCardConfig(uuid, newConfig);
    if (updated) router.push('/settings/cards');
  };

  useEffect(() => {
    if (!cardsConfig.cards?.[uuid] || !cardsData?.[uuid]) return;
    const { name, description, status, limits } = cardsConfig.cards[uuid];

    const txLimit = limits.find((limit: Limit) => {
      if (limit.delta === defaultTXLimit.delta) return limit;
    });

    const dailyLimit = limits.find((limit: Limit) => {
      if (limit.delta === defaultDailyLimit.delta) return limit;
    });

    const preloadConfig: CardPayload = {
      name,
      description,
      status,
      limits: txLimit ? [txLimit] : dailyLimit ? [dailyLimit] : [defaultTXLimit],
    };

    setNewConfig(preloadConfig);
  }, [cardsConfig.cards]);

  const { formatAmount } = useFormatter({ currency: 'SAT', locale: lng });

  useActionOnKeypress('Enter', handleSaveConfig, [newConfig]);

  if (!loadInfo.loading && !cardsData?.[uuid]) return null;

  return (
    <>
      <Navbar
        showBackPage={true}
        title={loadInfo.loading ? t('LOADING') : cardsData[uuid].design.name}
        overrideBack="/settings/cards"
      />

      {loadInfo.loading ? (
        <Loader />
      ) : (
        <Container size="small">
          <Divider y={24} />

          <InputWithLabel
            onChange={handleChangeName}
            isError={
              errors.isExactError('EMPTY_NAME') ||
              errors.isExactError('MAX_LENGTH_NAME', {
                length: `${NAME_MAX_LENGTH}`,
              })
            }
            name="card-name"
            label={t('NAME')}
            placeholder={t('NAME')}
            value={newConfig.name}
          />

          <Divider y={12} />

          <InputWithLabel
            onChange={handleChangeDesc}
            isError={errors.isExactError('MAX_LENGTH_DESC', {
              length: `${DESC_MAX_LENGTH}`,
            })}
            name="card-desc"
            label={t('DESCRIPTION')}
            placeholder={t('DESCRIPTION')}
            value={newConfig.description}
          />

          <Divider y={24} />

          <Heading as="h5">{t('LIMITS')}</Heading>

          <Divider y={12} />

          <Flex justify="space-between" align="center">
            <Text isBold={true}>{t('LIMIT_TYPE')}</Text>

            <Flex align="center" flex={0} gap={8}>
              <Label htmlFor="type-limit">{t('TX_LIMIT')}</Label>
              <ToggleSwitch
                switchEnabled={selectedLimit === 'daily'}
                onChange={(bool) => {
                  setNewConfig({
                    ...newConfig,
                    limits: [
                      !bool
                        ? {
                            ...defaultTXLimit,
                            amount: newConfig.limits[0].amount,
                          }
                        : {
                            ...defaultDailyLimit,
                            amount: newConfig.limits[0].amount,
                          },
                    ],
                  });
                }}
              />
              <Label htmlFor="type-limit">{t('DAILY_LIMIT')}</Label>
            </Flex>
          </Flex>

          <Divider y={24} />

          <LimitInput
            onChange={handleChangeLimit}
            amount={newConfig.limits.length ? roundToDown(Number(newConfig.limits[0].amount) / 1000, 0) : 0}
            currency={'SAT'}
          />

          <Divider y={8} />

          <Flex flex={1} justify="center">
            <Text color={appTheme.colors.warning}>
              {newConfig.limits.length && Number(newConfig.limits[0].amount) > 0
                ? t(`LIMIT_CARD_PER_${selectedLimit === 'tx' ? 'TX' : 'DAY'}`, {
                    sats: formatAmount(Number(newConfig.limits[0].amount) / 1000),
                  })
                : t('NO_LIMIT_SET')}
            </Text>
          </Flex>

          <Divider y={24} />
        </Container>
      )}

      <Flex>
        <Container size="small">
          <Divider y={12} />

          <Flex flex={1} align="center" justify="center">
            <Feedback show={errors.errorInfo.visible} status={errors.errorInfo.visible ? 'error' : undefined}>
              {errors.errorInfo.text}
            </Feedback>
          </Flex>

          <Divider y={16} />
          <Flex gap={8}>
            <Button variant="bezeledGray" onClick={() => router.push('/settings/cards')}>
              {t('CANCEL')}
            </Button>
            <Button onClick={handleSaveConfig}>{t('SAVE')}</Button>
          </Flex>
          <Divider y={32} />
        </Container>
      </Flex>
    </>
  );
};

export default page;
