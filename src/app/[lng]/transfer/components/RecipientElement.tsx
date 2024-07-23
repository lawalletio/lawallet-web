import { Avatar, Flex, Text } from '@lawallet/ui';
import { extractFirstTwoChars } from '@/utils';
import { splitHandle } from '@lawallet/react';

const RecipientElement = ({ lud16 }: { lud16: string }) => {
  const [username, domain] = splitHandle(lud16);
  return (
    <Flex align="center" gap={8}>
      <Avatar>
        <Text size="small">{extractFirstTwoChars(username)}</Text>
      </Avatar>
      <Flex align="center">
        <Text>{username}</Text>
        <Text>@{domain}</Text>
      </Flex>
    </Flex>
  );
};

export default RecipientElement;
