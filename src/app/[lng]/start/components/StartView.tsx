'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { CardAlert, Container, Divider, Feedback, Flex, Text, Loader } from '@lawallet/ui';

import { useRouter } from '@/navigation';
import { checkIOS } from '@/utils';

import HomeDescription from '@/app/[lng]/start/components/HomeDescription';
import Logo from '@/components/Logo';
import { Button } from '@/components/UI/button';

import { appTheme } from '@/config/exports';

const StartView = ({ onClick, verifyingNonce, isValidNonce }) => {
  const t = useTranslations();
  const [isIOS, setIsIOS] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    if (isValidNonce) setIsIOS(checkIOS(navigator));
  }, [isValidNonce]);

  return (
    <Container size="small">
      <Divider y={16} />
      <Flex direction="column" align="center" justify="center" gap={8} flex={1}>
        <Logo />
        <Text align="center" color={appTheme.colors.gray50}>
          v{process.env.version}
        </Text>
      </Flex>

      <Flex direction="column">
        {verifyingNonce ? (
          <Loader />
        ) : isValidNonce ? (
          <>
            <HomeDescription />
            <Divider y={16} />

            {isIOS && (
              <>
                <CardAlert
                  title={t('RECOMMEND_SAFARI_TITLE')}
                  description={
                    <>
                      <strong>{t('RECOMMEND_SAFARI')}</strong> {t('RECOMMEND_SAFARI_REASON')}
                    </>
                  }
                />
                <Divider y={16} />
              </>
            )}

            <Button className="w-full" onClick={onClick}>
              {t('START')}
            </Button>
          </>
        ) : (
          <>
            <Flex align="center" justify="center">
              <Feedback show={true} status={'error'}>
                {t('INVALID_NONCE')}
              </Feedback>
            </Flex>

            <Divider y={16} />

            <Button className="w-full" onClick={() => router.push('/')}>
              {t('BACK_TO_HOME')}
            </Button>
          </>
        )}
      </Flex>
      <Divider y={32} />
    </Container>
  );
};

export default StartView;
