'use client';
import Logo from '@/components/Logo';
import { Loader } from '@lawallet/ui';

import { StoragedIdentityInfo } from '@/components/AppProvider/AuthProvider';
import { appTheme } from '@/config/exports';
import useErrors from '@/hooks/useErrors';
import { saveIdentityToStorage } from '@/utils';
import { buildCardActivationEvent, useConfig, useIdentity, useNostr } from '@lawallet/react';
import { cardResetCaim } from '@lawallet/react/actions';
import { Container, Feedback, Flex, Heading, Text } from '@lawallet/ui';
import { NostrEvent } from '@nostr-dev-kit/ndk';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { generatePrivateKey, getPublicKey } from 'nostr-tools';
import { useEffect } from 'react';

export default function Page() {
  const t = useTranslations();
  const identity = useIdentity();

  const config = useConfig();
  const router = useRouter();
  const errors = useErrors();
  const params = useSearchParams();

  const { initializeSigner } = useNostr();

  useEffect(() => {
    if (identity.pubkey.length) return;

    const recoveryNonce: string = params.get('n') || '';
    if (!recoveryNonce) {
      router.push('/');
      return;
    }

    const randomHexPKey: string = generatePrivateKey();
    buildCardActivationEvent(recoveryNonce, randomHexPKey, config)
      .then((cardEvent: NostrEvent) => {
        cardResetCaim(cardEvent, config).then((res) => {
          if (res.error) errors.modifyError(res.error);

          if (res.name) {
            identity.initializeFromPrivateKey(randomHexPKey, res.name).then(() => {
              const identityToSave: StoragedIdentityInfo = {
                username: res.name,
                pubkey: getPublicKey(randomHexPKey),
                privateKey: randomHexPKey,
              };

              saveIdentityToStorage(config.storage, identityToSave).then(() => {
                initializeSigner(identity.signer);
                router.push('/dashboard');
              });
            });
          } else {
            errors.modifyError('ERROR_ON_RESET_ACCOUNT');
          }
        });
      })
      .catch(() => router.push('/'));
  }, []);

  return (
    <Container size="medium">
      <Flex direction="column" align="center" justify="center" gap={8} flex={1}>
        <Logo />
        <Text align="center" color={appTheme.colors.gray50}>
          v{process.env.version}
        </Text>
      </Flex>

      <Flex direction="column" align="center" justify="center">
        <Heading as="h2">{t('RECOVERING_ACCOUNT')}</Heading>
      </Flex>

      <Flex flex={1} justify="center" align="center">
        <Loader />
      </Flex>

      <Flex flex={1} justify="center" align="center">
        <Feedback show={errors.errorInfo.visible} status={'error'}>
          {errors.errorInfo.text}
        </Feedback>
      </Flex>
    </Container>
  );
}
