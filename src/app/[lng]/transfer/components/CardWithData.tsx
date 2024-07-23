import { useRouter } from '@/navigation';
import { CrossIcon } from '@bitcoin-design/bitcoin-icons-react/filled';
import { formatAddress, splitHandle, useConfig } from '@lawallet/react';
import { TransferTypes } from '@lawallet/react/types';
import { Avatar, Card, Flex, Text, Button } from '@lawallet/ui';

import { useTranslations } from 'next-intl';

import { extractFirstTwoChars } from '@/utils';

const CardWithData = ({ type, data }: { type: TransferTypes; data: string }) => {
  const router = useRouter();
  const t = useTranslations();
  const config = useConfig();
  const [transferUsername, transferDomain] = splitHandle(data, config);

  return (
    <Card>
      <Flex align="center" gap={8}>
        {type === TransferTypes.LNURLW ? (
          <Text size="small">{t('CLAIM_THIS_INVOICE')}</Text>
        ) : (
          <Avatar size="large">
            <Text size="small">{extractFirstTwoChars(transferUsername)}</Text>
          </Avatar>
        )}
        {type === TransferTypes.INVOICE || type === TransferTypes.LNURLW ? (
          <Text>{formatAddress(data, 15)}</Text>
        ) : (
          <Text>
            {transferUsername}@{transferDomain}
          </Text>
        )}
      </Flex>
      <Button onClick={() => router.push('/transfer')} variant="borderless">
        <CrossIcon />
      </Button>
    </Card>
  );
};

export default CardWithData;
