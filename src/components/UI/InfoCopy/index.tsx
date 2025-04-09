import { useTranslations } from 'next-intl';
import { Flex, Text } from '@lawallet/ui';

import { copy } from '@/utils/share';
import { useToast } from '@/hooks/use-toast';

import { Button } from '../button';

import { appTheme } from '@/config/exports';
import { InfoCopy } from './style';

interface ComponentProps {
  title: string;
  value: string;
  onCopy?: () => void;
}

export default function Component(props: ComponentProps) {
  const { title, value, onCopy = null } = props;

  const t = useTranslations();
  const { toast } = useToast();

  const handleCopy = () => {
    copy(value).then((res) => {
      toast({
        description: res ? t('SUCCESS_COPY') : t('ERROR_COPY'),
        variant: res ? 'default' : 'destructive',
        duration: 1400,
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
            <Button size="sm" variant="secondary" onClick={handleCopy}>
              {t('COPY')}
            </Button>
          </div>
        </Flex>
      </InfoCopy>
    </>
  );
}
