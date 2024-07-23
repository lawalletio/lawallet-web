import Logo from '@/components/Logo';
import { appTheme } from '@/config/exports';
import { Container, Divider, Flex, Text } from '@lawallet/ui';
import React, { ReactNode } from 'react';

type EmptyViewProps = {
  children?: ReactNode;
};

const EmptyView = ({ children }: EmptyViewProps) => {
  return (
    <Container size="medium">
      <Divider y={16} />
      <Flex direction="column" align="center" justify="center" gap={8} flex={1}>
        <Logo />
        <Text align="center" size="small" color={appTheme.colors.white}>
          v{process.env.version}
        </Text>
      </Flex>

      {children}
    </Container>
  );
};

export default EmptyView;
