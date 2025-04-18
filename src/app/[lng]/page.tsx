'use client';

import Logo from '@/components/Logo';
import { Divider, Container, Flex, Text } from '@lawallet/ui';
import { Button } from '@/components/UI/button';

import { appTheme } from '@/config/exports';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/navigation';

export default function Page() {
  const t = useTranslations();
  const router = useRouter();

  // const { handleCreateIdentity, loading } = useCreateIdentity()
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
        {/* <Divider y={16} />

        <Flex>
          <Button
            onClick={() =>
              handleCreateIdentity({ name: '', card: '', nonce: '' })
            }
            loading={loading}
          >
            {t('CREATE_ACCOUNT')}
          </Button>
        </Flex> */}

        <Divider y={16} />

        <Button className="w-full" onClick={() => router.push('/signup')}>
          {t('CREATE_ACCOUNT')}
        </Button>
        <Divider y={8} />
        <Button className="w-full" variant="secondary" onClick={() => router.push('/login')}>
          {t('LOGIN_ACCOUNT')}
        </Button>
      </Flex>
      <Divider y={32} />
    </Container>
  );
}
