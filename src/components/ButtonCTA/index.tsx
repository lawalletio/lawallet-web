import { ReactNode } from 'react';

import { Default } from './style';

interface ButtonCTAProps {
  children: ReactNode;
}

export default function ButtonCTA(props: ButtonCTAProps) {
  const { children } = props;

  return (
    <Default>
      <div>{children}</div>
    </Default>
  );
}
