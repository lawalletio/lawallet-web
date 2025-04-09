'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { normalizeLNDomain, useConfig } from '@lawallet/react';
import { validateNonce } from '@lawallet/react/actions';
import { Container, Divider, Feedback, Flex, Heading, Input, InputGroup, InputGroupRight, Text } from '@lawallet/ui';

import { useActionOnKeypress } from '@/hooks/useActionOnKeypress';
import { useCreateIdentity } from '@/hooks/useCreateIdentity';

import StartView from '@/app/[lng]/start/components/StartView';
import Navbar from '@/components/Layout/Navbar';
import { Button } from '@/components/UI/button';
import { LoaderCircle } from 'lucide-react';

export default function Page() {
  const config = useConfig();
  const t = useTranslations();

  const [activeStartView, setActiveStartView] = useState<boolean>(true);

  const { handleCreateIdentity, accountInfo, setAccountInfo, handleChangeUsername, loading, errors } =
    useCreateIdentity();

  const params = useSearchParams();

  const handleConfirm = () => {
    if (accountInfo.name && accountInfo.nonce) handleCreateIdentity(accountInfo);
  };

  useActionOnKeypress('Enter', handleConfirm, [accountInfo.name]);

  useEffect(() => {
    const nonce: string = params.get('i') || '';
    const card: string = params.get('c') || '';

    if (!nonce) {
      setAccountInfo({ ...accountInfo, loading: false });
    } else {
      validateNonce(nonce, config).then((isValidNonce) => {
        setAccountInfo({
          ...accountInfo,
          nonce,
          card,
          isValidNonce,
          loading: false,
        });
      });
    }
  }, []);

  if (activeStartView)
    return (
      <StartView
        verifyingNonce={accountInfo.loading}
        isValidNonce={accountInfo.isValidNonce}
        onClick={() => setActiveStartView(false)}
      />
    );

  return (
    <>
      <Navbar />
      <Container size="small">
        <Flex direction="column" justify="center">
          <Heading as="h2">{t('REGISTER_USER')}</Heading>

          <Divider y={8} />
          <InputGroup>
            <Input
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeUsername(e.target.value)}
              placeholder="Satoshi"
              type="text"
              id="username"
              name="username"
              status={errors.isExactError('NAME_ALREADY_TAKEN') ? 'error' : undefined}
              autoFocus={true}
              value={accountInfo.name}
              isLoading={accountInfo.loading}
              isError={accountInfo.loading ? undefined : errors.isExactError('NAME_ALREADY_TAKEN')}
              isChecked={
                accountInfo.loading
                  ? undefined
                  : !errors.isExactError('NAME_ALREADY_TAKEN') && Boolean(accountInfo.name)
              }
            />
            <InputGroupRight>
              <Text size="small">@{normalizeLNDomain(config.endpoints.lightningDomain)}</Text>
            </InputGroupRight>
          </InputGroup>
          <Feedback show={errors.errorInfo.visible} status={errors.errorInfo.visible ? 'error' : undefined}>
            {errors.errorInfo.text}
          </Feedback>
        </Flex>
      </Container>
      <Flex>
        <Container size="small">
          <Divider y={16} />
          <Flex gap={8}>
            <Button className="w-full" variant="secondary" onClick={() => setActiveStartView(true)}>
              {t('CANCEL')}
            </Button>
            <Button className="w-full" onClick={handleConfirm} disabled={loading || !accountInfo.nonce.length}>
              {loading ? <LoaderCircle className="size-4 animate-spin" /> : t('CONFIRM')}
            </Button>
          </Flex>
          <Divider y={32} />
        </Container>
      </Flex>
    </>
  );
}
