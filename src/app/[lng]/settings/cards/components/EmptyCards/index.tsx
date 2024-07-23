import { appTheme } from '@/config/exports';
import { useTranslations } from 'next-intl';
import { Container, Flex, Text } from '@lawallet/ui';
import EmptySvg from './EmptySvg';

const EmptyCards = () => {
  const t = useTranslations();

  return (
    <Container size="medium">
      <Flex flex={1} direction="column" align="center" justify="center" gap={16}>
        <EmptySvg />
        <Flex direction="column" gap={4} align="center">
          <Text isBold={true}>{t('NO_HAVE_CARDS')}</Text>
          <Text size="small" color={appTheme.colors.gray50}>
            {t('NOT_FOUND_CARD')}
          </Text>
        </Flex>
      </Flex>
    </Container>
  );
};

export default EmptyCards;
