'use client';

import { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { Flex, Container, Icon, Heading, Text } from '@lawallet/ui';
import { CaretLeftIcon } from '@bitcoin-design/bitcoin-icons-react/filled';

import { useRouter } from '@/navigation';
import { appTheme } from '@/config/exports';

// Constans
import { EMERGENCY_LOCK_DEPOSIT, EMERGENCY_LOCK_TRANSFER } from '@/utils/constants';

import { Navbar, BackButton, Left, Right, AlertSystemStyle } from './style';

interface ComponentProps {
  children?: ReactNode;
  title?: string;
  showBackPage?: boolean;
  overrideBack?: string;
}

export default function Component(props: ComponentProps) {
  const { children, showBackPage = false, title, overrideBack = '' } = props;

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
                  <BackButton
                    onClick={() => {
                      overrideBack ? router.push(overrideBack) : router.back();
                    }}
                  >
                    <Icon size="small">
                      <CaretLeftIcon />
                    </Icon>
                    {t('BACK')}
                  </BackButton>
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
            {onlyChildren && <Right></Right>}
          </Flex>
        </Container>
      </Navbar>
    </Flex>
  );
}
