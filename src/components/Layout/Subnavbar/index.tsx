'use client';

import { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { HomeIcon, RocketIcon } from '@bitcoin-design/bitcoin-icons-react/filled';
import { Container, Icon, QrCodeIcon, Text } from '@lawallet/ui';

import ButtonCTA from '@/components/ButtonCTA';
import { Button } from '@/components/UI/button';

import { appTheme, pluginsEnabled } from '@/config/exports';

import { SubnavbarPrimitive } from './style';
import { useRouter } from '@/navigation';

interface ComponentProps {
  children?: ReactNode;
  title?: string;
  showBackPage?: boolean;
  overrideBack?: string;
  path: string;
}

export default function Subnavbar(props: ComponentProps) {
  const { path = 'home' } = props;

  const router = useRouter();
  const t = useTranslations();

  if (!pluginsEnabled)
    return (
      <SubnavbarPrimitive backgroundColor={appTheme.colors.background}>
        <Container>
          <ButtonCTA>
            <Button color="secondary" onClick={() => router.push('/scan')}>
              <QrCodeIcon />
            </Button>
          </ButtonCTA>
        </Container>
      </SubnavbarPrimitive>
    );

  return (
    <SubnavbarPrimitive backgroundColor={appTheme.colors.gray10}>
      <Container>
        <div className="info">
          <button onClick={() => router.push('/dashboard')} className={`${path === 'home' && 'active'}`}>
            <Icon color={appTheme.colors.text}>
              <HomeIcon />
            </Icon>
            <Text size="small" color={appTheme.colors.text}>
              {t('HOME')}
            </Text>
          </button>

          <ButtonCTA>
            <Button color="secondary" onClick={() => router.push('/scan')}>
              <QrCodeIcon />
            </Button>
          </ButtonCTA>

          <button onClick={() => router.push('/extensions')} className={`${path === 'plugins' && 'active'}`}>
            <Icon color={appTheme.colors.text}>
              <RocketIcon />
            </Icon>
            <Text size="small" color={appTheme.colors.text}>
              Plugins
            </Text>
          </button>
        </div>
      </Container>
    </SubnavbarPrimitive>
  );
}
