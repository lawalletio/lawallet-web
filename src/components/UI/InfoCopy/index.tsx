import { useTranslations } from 'next-intl';
import { copy } from '@/utils/share';

import { Button, Flex, Text } from '@lawallet/ui';

import { appTheme } from '@/config/exports';
import { useNotifications } from '@/context/NotificationsContext';
import { InfoCopy } from './style';

interface ComponentProps {
  title: string;
  value: string;
  onCopy?: () => void;
}

export default function Component(props: ComponentProps) {
  const { title, value, onCopy = null } = props;

  const t = useTranslations();
  const notifications = useNotifications();

  const handleCopy = () => {
    copy(value).then((res) => {
      notifications.showAlert({
        description: res ? t('SUCCESS_COPY') : t('ERROR_COPY'),
        type: res ? 'success' : 'error',
      });

      if (onCopy) onCopy();
    });
  };

  return (
    <>
      <InfoCopy>
        <Flex align="center" gap={8} flex={1}>
          <Flex direction="column" flex={1}>
            <Text size="small" color={appTheme.colors.gray50}>
              {title}
            </Text>
            <Text>{value}</Text>
          </Flex>
          <div>
            <Button size="small" variant="bezeled" onClick={handleCopy}>
              {t('COPY')}
            </Button>
          </div>
        </Flex>
      </InfoCopy>
    </>
  );
}
