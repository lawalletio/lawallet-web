'use client';
import { ChangeEvent, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/navigation';
import { getPublicKey, nip19 } from 'nostr-tools';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils';
import { useConfig, useIdentity, useNostr } from '@lawallet/react';
import { getUsername } from '@lawallet/react/actions';
import { Container, Divider, Feedback, Flex, Heading } from '@lawallet/ui';

import { saveIdentityToStorage } from '@/utils';
import { useActionOnKeypress } from '@/hooks/useActionOnKeypress';
import useErrors from '@/hooks/useErrors';

import Navbar from '@/components/Layout/Navbar';
import { StoragedIdentityInfo } from '@/components/AppProvider/AuthProvider';
import { Input } from '@/components/UI/input';
import { Button } from '@/components/UI/button';
import { LoaderCircle } from 'lucide-react';

export default function Page() {
  const { initializeSigner } = useNostr();

  const [keyInput, setKeyInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const t = useTranslations();
  const config = useConfig();
  const router = useRouter();
  const errors = useErrors();
  const identity = useIdentity();

  const handleChangeInput = (e: any) => {
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
      let hexSecretKey: string = keyInput;

      if (hexSecretKey.startsWith('nsec1')) {
        const { type, data } = nip19.decode(keyInput);

        if (type === 'nsec') hexSecretKey = bytesToHex(data);
      } else if (hexSecretKey.startsWith('0x')) {
        hexSecretKey = hexSecretKey.substring(2, hexSecretKey.length);
      }

      const pubkey: string = getPublicKey(hexToBytes(hexSecretKey));
      const username: string = await getUsername(pubkey, config);

      // if (!username.length) {
      //   errors.modifyError('NOT_FOUND_PUBKEY');
      //   setLoading(false);
      //   return;
      // }

      identity.initializeFromPrivateKey(hexSecretKey, username).then((res) => {
        if (res) {
          const IdentityToSave: StoragedIdentityInfo = {
            username,
            pubkey,
            privateKey: hexSecretKey,
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
          <Input type="password" placeholder={t('INSERT_PRIVATE_KEY')} onChange={handleChangeInput} />

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
            <Button className="w-full" variant="secondary" onClick={() => router.push('/')}>
              {t('CANCEL')}
            </Button>
            <Button className="w-full" onClick={handleRecoveryAccount} disabled={!keyInput.length || loading}>
              {loading ? <LoaderCircle className="size-6 animate-spin" /> : t('LOGIN')}
            </Button>
          </Flex>
          <Divider y={32} />
        </Container>
      </Flex>
    </>
  );
}
