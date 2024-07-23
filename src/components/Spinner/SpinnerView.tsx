import Logo from '@/components/Logo';
import { appTheme } from '@/config/exports';
import { Container, Divider, Flex, Loader, Text } from '@lawallet/ui';

const SpinnerView = ({ loadingText }: { loadingText?: string }) => {
  return (
    <Container size="medium">
      <Divider y={16} />
      <Flex direction="column" align="center" justify="center" gap={8} flex={1}>
        <Logo />
        <Text align="center" size="small" color={appTheme.colors.white}>
          v{process.env.version}
        </Text>
      </Flex>

      <Flex flex={1} direction="column" justify="center" align="center">
        <Loader />
        <Text>{loadingText}</Text>
      </Flex>
    </Container>
  );
};

export default SpinnerView;
