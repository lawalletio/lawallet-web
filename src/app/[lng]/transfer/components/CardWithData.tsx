import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { formatAddress, splitHandle, useConfig } from '@lawallet/react';
import { TransferTypes } from '@lawallet/react/types';
import { Avatar, Card, Flex, Text } from '@lawallet/ui';
import { X } from 'lucide-react';

import { useRouter } from '@/navigation';
import { extractFirstTwoChars } from '@/utils';

import { Button } from '@/components/UI/button';

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
      <Button size="icon" variant="ghost" asChild>
        <Link href="/transfer">
          <X className="size-4" />
        </Link>
      </Button>
    </Card>
  );
};

export default CardWithData;
