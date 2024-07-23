'use client';
import { useRouter } from '@/navigation';
import { Button, Flex, Text } from '@lawallet/ui';
import EmptyView from './EmptyView';
import { useTranslations } from 'next-intl';

const PluginsEmptyView = () => {
  const router = useRouter();
  const t = useTranslations();

  return (
    <EmptyView>
      <Text align="center">{t('PLUGINS_NOT_ENABLED')}</Text>

      <Flex flex={1}>
        <Button onClick={() => router.push('/dashboard')} variant="borderless">
          {t('GO_HOME')}
        </Button>
      </Flex>
    </EmptyView>
  );
};

export default PluginsEmptyView;
