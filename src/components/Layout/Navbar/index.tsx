'use client';

import { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { Flex, Container, Heading, Text } from '@lawallet/ui';

import { useRouter } from '@/navigation';
import { appTheme } from '@/config/exports';

// Constans
import { EMERGENCY_LOCK_DEPOSIT, EMERGENCY_LOCK_TRANSFER, SUPPORT_TELEGRAM_URL } from '@/utils/constants';

import { Navbar, Left, Right, AlertSystemStyle } from './style';
import { Button } from '@/components/UI/button';
import { ArrowLeft, CircleHelp } from 'lucide-react';

interface ComponentProps {
  children?: ReactNode;
  title?: string;
  showBackPage?: boolean;
  overrideBack?: string;
  showHelpButton?: boolean;
}

export default function Component(props: ComponentProps) {
  const { children, showBackPage = false, title, overrideBack = '', showHelpButton = false } = props;

  const router = useRouter();
  const t = useTranslations();

  const onlyChildren = !children;

  return (
    <Flex direction="column">
      {(EMERGENCY_LOCK_DEPOSIT || EMERGENCY_LOCK_TRANSFER) && (
        <AlertSystemStyle $background={appTheme.colors.error15}>
          <Container>
            <Flex flex={1} justify="center" align="center">
              <Text color={appTheme.colors.error}>
                {t('PAUSED')}: {EMERGENCY_LOCK_DEPOSIT && t('DEPOSITS')}{' '}
                {EMERGENCY_LOCK_DEPOSIT && EMERGENCY_LOCK_TRANSFER && t('AND')}{' '}
                {EMERGENCY_LOCK_TRANSFER && t('TRANSFERS')}
              </Text>
            </Flex>
          </Container>
        </AlertSystemStyle>
      )}
      <Navbar>
        <Container>
          <Flex flex={1} align="center" gap={8}>
            {onlyChildren && (
              <Left>
                {showBackPage && (
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => {
                      overrideBack ? router.push(overrideBack) : router.back();
                    }}
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                )}
              </Left>
            )}
            {title ? (
              <Flex justify="center">
                <Heading as="h5">{title}</Heading>
              </Flex>
            ) : (
              children
            )}
            {onlyChildren && (
              <Right>
                {showHelpButton && (
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => {
                      router.push(SUPPORT_TELEGRAM_URL);
                    }}
                  >
                    <CircleHelp />
                  </Button>
                )}
              </Right>
            )}
          </Flex>
        </Container>
      </Navbar>
    </Flex>
  );
}
