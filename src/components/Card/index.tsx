import Image from 'next/image';

import { Design } from '@lawallet/react/types';
import { Card } from './style';

interface ComponentProps {
  data: { design: Design };
  active: boolean;
}

export default function Component(props: ComponentProps) {
  const { data, active } = props;

  return (
    <Card $isActive={active}>
      <Image src={`/cards/${data.design.uuid}.png`} alt={data.design.uuid} width={280} height={176} />
    </Card>
  );
}
