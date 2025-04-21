import React from 'react';
import { Animations } from './style';
import { Loader } from '../Icons/Loader';

interface ComponentProps {
  data: unknown;
}

export default function Component({ data }: ComponentProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [Lottie, setLottie] = React.useState<any>(null);

  React.useEffect(() => {
    import('lottie-react').then((mod) => {
      setLottie(() => mod.default);
    });
  }, []);

  if (!Lottie) return <Loader />;

  return (
    <Animations>
      <Lottie animationData={data} loop />
    </Animations>
  );
}
