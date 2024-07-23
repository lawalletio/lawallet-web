import Lottie from 'lottie-react';

import { Animations } from './style';

interface ComponentProps {
  data: unknown;
}

export default function Component(props: ComponentProps) {
  const { data } = props;

  return (
    <Animations>
      <Lottie animationData={data} loop={true} />
    </Animations>
  );
}
