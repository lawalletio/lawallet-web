'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { MappedStoragedKeys, useConfig, useIdentity } from '@lawallet/react';
import { Container, Divider, Flex, Label, Text, ToggleSwitch } from '@lawallet/ui';

import { useRouter } from '@/navigation';
import { getUserStoragedKey } from '@/utils';

import Navbar from '@/components/Layout/Navbar';
import { InfoCopy } from '@/components/UI';
import { Button } from '@/components/UI/button';

import { appTheme } from '@/config/exports';
import { nip19 } from 'nostr-tools';
import { hexToBytes } from '@noble/hashes/utils';

export default function Page() {
  const t = useTranslations();
  const config = useConfig();
  const router: AppRouterInstance = useRouter();

  const [userStoragedKey, setUserStoragedKey] = useState<string>('');

  const identity = useIdentity();
  const [switchOne, setSwitchOne] = useState<boolean>(false);
  const [switchTwo, setSwitchTwo] = useState<boolean>(false);

  const [showRecovery, setShowRecovery] = useState<boolean>(false);

  const handleShowRecovery = () => {
    if (switchOne || switchTwo) setShowRecovery(true);
  };

  const loadStoragedKey = async () => {
    const storagedKey = await getUserStoragedKey(config.storage);
    if (!storagedKey) return;

    const nsec = nip19.nsecEncode(hexToBytes(storagedKey));
    setUserStoragedKey(nsec);
  };

  useEffect(() => {
    loadStoragedKey();
  }, []);

  return (
    <>
      <Navbar title={t('BACKUP_ACCOUNT')} showBackPage={true} overrideBack={'/settings'} />

      {showRecovery ? (
        <>
          <Container size="small">
            <InfoCopy
              title={t('PRIVATE_KEY')}
              value={userStoragedKey}
              onCopy={async () => {
                await config.storage.setItem(`${MappedStoragedKeys.Backup}_${identity.pubkey}`, '1');
              }}
            />
            <Divider y={16} />
          </Container>

          <Flex>
            <Container size="small">
              <Divider y={16} />
              <Flex gap={8}>
                <Button className="w-full" variant="secondary" onClick={() => router.push('/dashboard')}>
                  {t('CANCEL')}
                </Button>
              </Flex>
              <Divider y={32} />
            </Container>
          </Flex>
        </>
      ) : (
        <>
          <Container size="small">
            <Divider y={16} />
            <Text size="small" color={appTheme.colors.gray50}>
              {t('UNDERSTAND_WHAT')}
            </Text>
            <Divider y={8} />
            <Flex direction="column" gap={8}>
              <Flex justify="space-between" align="center" gap={8}>
                <Label htmlFor="lose-key">{t('LOSE_KEY')}</Label>
                <ToggleSwitch id="lose-key" onChange={setSwitchOne} />
              </Flex>
              <Flex justify="space-between" align="center" gap={8}>
                <Label htmlFor="share-key">{t('SHARE_KEY')}</Label>
                <ToggleSwitch id="share-key" onChange={setSwitchTwo} />
              </Flex>
            </Flex>
            <Divider y={16} />
          </Container>

          <Flex>
            <Container size="small">
              <Divider y={16} />
              <Flex gap={8}>
                <Button className="w-full" variant="secondary" onClick={() => router.push('/dashboard')}>
                  {t('CANCEL')}
                </Button>

                <Button className="w-full" onClick={handleShowRecovery} disabled={!switchOne || !switchTwo}>
                  {t('CONFIRM')}
                </Button>
              </Flex>
              <Divider y={32} />
            </Container>
          </Flex>
        </>
      )}
    </>
  );
}
