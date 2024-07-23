'use client';
import { useRouter } from '@/navigation';

import { StoragedIdentityInfo } from '@/components/AppProvider/AuthProvider';
import Navbar from '@/components/Layout/Navbar';
import { useActionOnKeypress } from '@/hooks/useActionOnKeypress';
import useErrors from '@/hooks/useErrors';
import { saveIdentityToStorage } from '@/utils';
import { useConfig, useIdentity, useNostr } from '@lawallet/react';
import { getUsername } from '@lawallet/react/actions';
import { Button, Container, Divider, Feedback, Flex, Heading, Textarea } from '@lawallet/ui';
import { useTranslations } from 'next-intl';
import { getPublicKey } from 'nostr-tools';
import { ChangeEvent, useState } from 'react';

export default function Page() {
  const { initializeSigner } = useNostr();

  const [keyInput, setKeyInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const t = useTranslations();
  const config = useConfig();
  const router = useRouter();
  const errors = useErrors();
  const identity = useIdentity();

  const handleChangeInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    errors.resetError();
    setKeyInput(e.target.value);
  };

  const handleRecoveryAccount = async () => {
    if (keyInput.length < 32) {
      errors.modifyError('KEY_LENGTH_ERROR');
      return;
    }

    setLoading(true);

    try {
      const pubkey: string = getPublicKey(keyInput);
      const username: string = await getUsername(pubkey, config);

      if (!username.length) {
        errors.modifyError('NOT_FOUND_PUBKEY');
        setLoading(false);
        return;
      }

      identity.initializeFromPrivateKey(keyInput, username).then((res) => {
        if (res) {
          const IdentityToSave: StoragedIdentityInfo = {
            username,
            pubkey,
            privateKey: keyInput,
          };

          saveIdentityToStorage(config.storage, IdentityToSave, true).then(() => {
            initializeSigner(identity.signer);
            router.push('/dashboard');
          });
        }
      });
    } catch (err) {
      errors.modifyError('UNEXPECTED_RECEOVERY_ERROR');
    }

    setLoading(false);
  };

  useActionOnKeypress('Enter', handleRecoveryAccount, [keyInput]);

  return (
    <>
      <Navbar />
      <Container size="small">
        <Flex direction="column" justify="center">
          <Heading as="h2">{t('LOGIN_TITLE')}</Heading>

          <Divider y={8} />
          <Textarea placeholder={t('INSERT_PRIVATE_KEY')} onChange={handleChangeInput} />

          <Feedback show={errors.errorInfo.visible} status={'error'}>
            {errors.errorInfo.text}
          </Feedback>
        </Flex>
      </Container>

      {/* <Button onClick={authWithExtension}>login with extension</Button> */}

      <Flex>
        <Container size="small">
          <Divider y={16} />
          <Flex gap={8}>
            <Button variant="bezeledGray" onClick={() => router.push('/')}>
              {t('CANCEL')}
            </Button>
            <Button onClick={handleRecoveryAccount} disabled={!keyInput.length || loading} loading={loading}>
              {t('LOGIN')}
            </Button>
          </Flex>
          <Divider y={32} />
        </Container>
      </Flex>
    </>
  );
}
